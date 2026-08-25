# Moovies: Cinematic 3D & SVG Animation Engine

A highly interactive, hardware-accelerated React landing page engine. This project bypasses standard CSS keyframes and external WebGL libraries (like Three.js), opting instead for a highly orchestrated combination of the Web Animations API (WAAPI), SVG SMIL (`<animate>`), and CSS 3D transforms to create a synchronized, cinematic 3D experience directly in the DOM.

## System Architecture

The codebase is decoupled into a highly efficient, three-tier rendering pipeline designed to keep the main thread unblocked and prioritize compositor-driven animations.

- **The Blueprint (`Animations.js`):** A pure configuration module exporting raw JavaScript objects. It isolates all WAAPI keyframes, easing curves, and timing configurations from the component logic.
- **The Stage (`Home.scss`):** Establishes the static 3D spatial environments (`perspective`, `transform-style: preserve-3d`) and structural CSS Grid layouts. It integrates CSS Houdini `@property` definitions to allow JavaScript to smoothly interpolate complex background gradients.
- **The Orchestrator (`Home.js`):** The React controller that binds DOM nodes, calculates hardware-specific viewport constraints, and executes the asynchronous WAAPI sequences.

---

## Core Rendering Mechanics

### 3D DOM Illusion Engine

The 3D typography is constructed purely through DOM manipulation, scaling dynamically without WebGL.

- **Dynamic Z-Axis Stacking:** Generates up to 25 copies of each letter (based on viewport size) and stacks them along the Z-axis using `translateZ` to simulate physical geometry.
- **Viewport Proportionality:** The `protrusionSize` scales procedurally from 9 to 25 layers via Media Query List (MQL) event listeners, ensuring the geometric depth remains strictly proportional to the dynamic CSS `clamp()` font size across all hardware.
- **Center-Point Rotation:** A `ResizeObserver` monitors the exact bounding box of the front letter node, dynamically updating the parent container's dimensions to ensure 3D rotations orbit a flawless absolute center without wobble.

### SVG Choreography & Procedural Morphing

- **Responsive Spatial Routing:** The catalyst star travels along a dynamically generated CSS `offset-path` (transitioning from an `ellipse` to a `ray`) dictated by viewport and orientation constraints.
- **Procedural Trigonometry:** As the star morphs into a circle, a `useMemo` hook calculates procedural trigonometry (`Math.cos`, `Math.sin`) to generate a sweeping arc, mathematically injecting SVG commands while mitigating native SVG large-arc precision bugs.
- **3D Shatter Engine:** A localized physics simulation mapped onto 44 independent SVG vector paths. Each shard uses a configuration dictionary dictating exact `translate3d` coordinates and randomized `rotate3d` axis multipliers.

### Elastic Typographic Physics

- **Rubber-Band Keyframing:** WAAPI keyframe arrays compress the X-axis scale while translating elements horizontally to create a bouncy, elastic impact for the interactive reset button.
- **Staggered Inward Snapping:** An algorithmic timing loop applies dynamic delays (decrementing by 100ms toward the center, inserting a micro-gap, and incrementing outward) to force the typography to aggressively snap inward from the outer edges simultaneously.

---

## Performance & Memory Mitigations

The architecture employs aggressive workarounds for native browser rendering flaws to maintain extreme performance and 60+ FPS on standard hardware.

- **The Perpendicular "I" Pillar Hack:** Rotating 3D-stacked CSS layers to 90 or 270 degrees exposes gaps. The engine injects left and right caps using the letter "I" (which is exactly 20px wide and naturally centered) to obscure these gaps. WAAPI timing functions toggle the opacity of these caps only during the perpendicular visual frames.
- **RAF Compositor Syncing:** Frame-time deltas are calculated using `requestAnimationFrame` and passed as negative `currentTime` delays to the animations, forcing the browser to align start times perfectly with the display's refresh rate.
- **WAAPI Garbage Collection:** Animations with `fill: 'forwards'` cause memory leaks. The cleanup routine filters through `document.getAnimations()`, executes `animation.commitStyles()` to write the final frame to inline CSS, and fires `animation.cancel()` to obliterate the animation object.
- **SMIL Timeline Reset:** SMIL (`<animate>`) tags write immutable timelines. To reset them, the logic advances the SVG internal clocks (`getCurrentTime() + 60`) into the deep future, subsequently triggering a global reset tag to snap vectors back to default coordinates.
- **Stable DOM Mapping (React 19 Ready):** Utilizes `useCallback` to generate stable ref callbacks that inject DOM nodes directly into centralized JavaScript `Map()` objects, returning inline cleanup functions to prevent memory leaks on unmount.
- **Chromium Blur Fix:** To bypass Chromium's permanent rasterization of SVGs when `transform-origin` and 3D transforms are applied, the shatter sequence deliberately forces a `filter: blur(6px)` that animates down to `0px` exactly as the shards explode outward, masking the browser's rendering flaw.

---

## Accessibility (a11y) & Hardware Awareness

- **Semantic Illusion:** To prevent screen readers from stuttering over 25 copies of the same text, `aria-hidden='true'` is applied to all middle, back, left, and right layers, exposing only the single `--front` node to the accessibility tree.
- **Keyboard Navigation:** Interactive SVGs are given `role='button'` and `tabIndex='0'`, with dedicated listeners mapping `Enter` and `Spacebar` keypresses directly onto the vector graphic.
- **Targeted Hardware Execution:** The layout queries `(pointer: fine)` to verify mouse presence; if on a touch device, it completely disables expensive `requestAnimationFrame` tracking loops for interactive hover states.
- **Strict Motion Control:** If `(prefers-reduced-motion: no-preference)` returns false, a safety override forces the component directly into the `'iddle'` phase, bypassing intense entrance animations while safely preserving the final visual layout.

---

# Authentication & Security Module (Frontend)

## Overview

This module handles the frontend authentication, registration, and authorization for the Moovies application. It implements a robust, JWT-based security flow using **React**, **Redux Toolkit (RTK Query)**, and **React Router v6**.

The architecture is designed to handle secure token storage, automatic token refresh (silent re-authentication), protected routing, and highly accessible (a11y) form validation.

## Core Architecture

### 1. API & Token Management (RTK Query)

The application communicates with the backend (`moovies-api`) using an RTK Query `apiSlice` equipped with an advanced request interceptor.

- **Authorization Headers**: The `prepareHeaders` function automatically injects the Bearer Access Token from the Redux store into every outgoing API request.
- **Silent Token Refresh (`baseQueryWithReauth`)**: If an API request fails with a `TokenExpiredError`, the application pauses the request and automatically hits the `/auth/refresh` endpoint.
  - **Success:** If a new token is returned, it updates the Redux store and seamlessly retries the original request.
  - **Failure:** If the refresh token is also expired or missing, it dispatches an error to the Redux store (`setCredentialsError`), clearing the session and forcing the user to log in again.

### 2. State Management (Redux Slice)

Authentication state is managed globally via `authSlice.js`.

- **State Tree:** Tracks the `token` (access token), `userId`, and any global authentication `error`.
- **Actions:**
  - `setCredentials`: Saves the tokens upon successful login, registration, or refresh.
  - `clearCredentials`: Wipes the session data on logout.
  - `setCredentialsError`: Handles session expiration states.
- **Selectors:** Provides clean access to the auth state (`selectAccessToken`, `selectTokenError`) for UI components.

### 3. Route Protection (React Router v6)

The application uses a layered approach to route protection via nested wrapper components:

- **Public Routes:** Accessible to everyone (e.g., Home, Search, Login, Register).
- **Protected Routes Layering:**
  1. `<PersistLogin/>`: Checks local/session storage to rehydrate the user's session before rendering children.
  2. `<RequireAuth/>`: Verifies that a valid token exists in the Redux store. If not, it intercepts the routing and displays an **Unauthorized** or **Error** view with a prompt to sign in.
  3. `<RequireVerification/>`: Ensures the authenticated user has verified their email before accessing sensitive routes like Settings or Watchlists.

### 4. User Interface & Form Handling (Login & Register)

The `Login` and `Register` components provide highly interactive, secure, and accessible entry points for users.

- **Custom Form Validation:** Instead of relying entirely on standard HTML popups, the forms use a `checkValidity()` check inside the submit handler to trigger `onInvalid` events. This allows custom state-driven error messages based on HTML5 validity states (`validity.valueMissing`, `validity.typeMismatch`, `validity.patternMismatch`).

- **Advanced Accessibility (a11y):**
  - `aria-live="assertive"` ensures screen readers announce validation errors and generic API errors dynamically as they appear.
  - `aria-describedby` links inputs directly to their respective error message paragraphs.
  - `aria-details` links complex inputs (like passwords and usernames) to tooltips explaining input requirements.
  - `aria-invalid` dynamically toggles to `true` when an input fails validation.
  - Includes visually hidden labels and `aria-pressed` states for toggle buttons.
- **Registration & API Error Mapping:** The registration form catches `409 Conflict` errors from the backend and dynamically maps them to specific input fields (e.g., "Email already exists" or "Username already exists") using `error.data.details[0].field`.
- **UX & Security Enhancements:**
  - Toggleable password visibility (with a security measure that ensures the input type is switched back to `password` immediately before the form submits).
  - "Stay signed in" (persistence) toggle using a custom `usePersist` hook.
  - `<HelmetWrapper/>` implementation for SEO-friendly page titles and meta descriptions.
  - Strict regex patterns for username (alphanumeric, must start with a letter) and password (8-24 chars, upper/lowercase, number, special character).

---

## Security Flow Summary

1. **Registration/Login:** User submits valid credentials -> RTK Query mutation fires -> Backend returns Access/Refresh tokens -> Stored in Redux.
2. **Accessing Protected Data:** React Router allows access to `<RequireAuth/>` children -> API calls attach Access Token.
3. **Token Expiry:** Access Token expires -> API call fails -> `baseQueryWithReauth` intercepts -> Calls `/refresh` -> Re-runs original request without the user noticing.
4. **Session Expiry:** Refresh Token expires -> Interceptor catches failure -> Redux state updates with error -> `<RequireAuth/>` dynamically boots the user to the login prompt.

---

# MoviesList Component

## Strict Accessibility (A11y) Standards

- **Semantic Structure:** Native HTML elements (`<dialog>`, `<output>`, `<hgroup>`) are utilized to provide inherent semantic meaning.
- **Screen Reader Optimization:** Complex visual data (e.g., fractional rating scores, runtime calculations) is consistently translated for screen readers utilizing `.visually-hidden` utility classes and precise `aria-` attributes, ensuring total comprehension without visual context.
- **Keyboard Navigation:** Implements a highly engineered roving `tabIndex` system within custom components (like the filtering toolbar). Captures specific keydown events (`Arrow` keys, `Home`, `End`, `Space`, `Escape`) to allow complete, mouse-free operability across dynamic dropdown menus and pagination controls.

## High-Performance Custom Animations

- **Zero-Dependency Animations:** Bypasses heavy, bloated third-party animation libraries.
- **Hardware Acceleration:** Utilizes native SMIL (`<animate>`) for complex SVG manipulations (e.g., radial gradients within star polygons) and the Web Animations API (`element.animate`) for scaling transformations.
- **Motion Preferences:** Respects system-level accessibility settings by wrapping animation execution logic in `prefers-reduced-motion` media queries, ensuring compliance for users with vestibular disorders.

## State & Data Synchronization

- **URL-Driven State:** The UI state is tightly coupled with the browser's URL search parameters (`sortBy`, `sort`, `page`). Custom implementation continuously validates and coerces the URL to ensure the application state is directly shareable, deterministic, and remains synchronized upon page reloads or browser navigation.

---
