import '../styles/Tooltip.scss';

// Problem!!! (happens only when using chrome in linux(pop-os) -- last test september)
// When i measure the performance with chrome dev-tools, it displays a lot of dropped frames even though only opacity and transform
// properties are animated. A big chunk is also shown when the delay on the animation is applied which has the same duration as the delay
// When tested with just a button and hidden element appearing on hover, the same thing appeared as a result with just changing the opacity.
// will-change CSS property does not make any difference.
// All tasks on the CPU run under 8ms, no memory leaks or GPU load.
// Switching the display from 170hz to 60hz helps a lot with the tests, but i still get some chunks of frames dropped even though
// there is nothing running, no tasks to CPU or GPU.
// On close inspection when a task is running through the animation, i get normal frames and when there is nothing i get dropped frames

////// IMPORTANT!!! /////
// 1. The element that the tooltip is referring to, either inside the wrapper or out of it must have the
// class 'has-tooltip' or 'has-tooltip-with-wrapper'
// 2. All props must be text - exept hasWrapper which is boolean
// 3. tip-position takes the values: ['top', 'bottom', 'left', 'right']

// Info on usage:
// For normal elements: use it as a wrapper component with the element that the tooltip refers to as a child(see ThemeButton)
// For absolutly positioned elements: use it inside the element without the wrapper(see AutocompleteForm)
// The tooltip must be associated with the element via aria-labeledby or describedby with its id

// CAUTION!!! If it is used either inside an element or as a wrapper, aria-labeledby overides the text in the element
// and screen readers only announce the label

// Best practice: Prefer using distinct labels as text eg: text in a button rather than using the tooltip as a label and prefer
// using it only as a descriptor with aria-describedby for extra information

// -- An exception to this is: when there is a button with only an image and information must be provided both for
// screen readers and as a description for sighted users, using just a label that is visually hidden is not enough
// so the tooltip is used instead to cover both cases

const Tooltip = ({
  children,
  id = '',
  text,
  tip,
  hasWrapper,
  hidden_50em = false,
  hidden_72em = false,
}) => {
  // Type Checking
  const checkIfString = (value, strName) => {
    if (typeof value === 'string' || value instanceof String) {
      return value;
    } else {
      console.error(
        `Tooltip Component "${strName}" prop only accepts Strings, your value was coerced into a String`
      );
      return String(value);
    }
  };

  const tipAllowedValues = ['top', 'bottom', 'left', 'right'];

  const checkTipAllowedValues = (tip) => {
    const strTip = checkIfString(tip, 'tip');
    if (tipAllowedValues.includes(strTip)) {
      return strTip;
    } else {
      const values = tipAllowedValues.join('", "');
      console.error(
        `Tooltip Component "tip" prop is required and only accepts the values ["${values}"] your value was coerced to "bottom"`
      );
      return 'bottom';
    }
  };

  // id has a default value of '' so no errors are thrown in case someone doesn't want to associate via labelledBy
  // or describedBy which is NOT recommended

  const validId = checkIfString(id, 'id');

  const validTip = checkTipAllowedValues(tip);

  let validText = checkIfString(text, 'text');

  if (!text) {
    console.error(
      `Tooltip Component "text" prop is required, please provide a value`
    );
    validText = 'provide text';
  }

  let validWrapper = hasWrapper;
  if (typeof hasWrapper !== 'boolean') {
    console.error(
      'Tooltip Component "hasWrapper" prop only accepts Boolean values and it is required, your value was coerced into true'
    );
    validWrapper = true;
  }

  const hiddenValues = [hidden_50em, hidden_72em];
  const validHiddenValues = hiddenValues.map((value) => {
    if (typeof value !== 'boolean') {
      console.error(
        `Tooltip Component hidden_50em & hidden_72em props accept only boolean values, your value was coerced to false`
      );
      return false;
    }
    return value;
  });

  const tooltip = (
    <div
      ref={(node) => {
        let timeOut;
        if (node) {
          // if the touch duration on the parent of the tooltip exceeds 400ms then prevent the browsers native pop-up and show tooltip (mobile-only)
          node.parentElement.oncontextmenu = (e) => e.preventDefault();
          node.parentElement.ontouchstart = (e) => {
            timeOut = setTimeout(() => {
              e.preventDefault();
              node.style.opacity = 1;
            }, 400);
          };
          node.parentElement.ontouchend = () => {
            clearTimeout(timeOut);
            node.style.opacity = 0;
          };
        }
      }}
      className='tooltip'
      role='tooltip'
      tip-position={validTip}
      id={validId}>
      {validText}
    </div>
  );

  return (
    <>
      {validWrapper ? (
        <div
          className={`tooltip-wrapper ${
            validHiddenValues[0] ? 'hidden-tooltip-50em' : null
          } ${validHiddenValues[1] ? 'hidden-tooltip-72em' : null}`}>
          {children}
          {tooltip}
        </div>
      ) : (
        tooltip
      )}
    </>
  );
};

export default Tooltip;
