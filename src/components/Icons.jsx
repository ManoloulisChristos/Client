import { memo } from 'react';

const IconWrapper = ({ width, height, svgClassName, children }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    strokeWidth='1.5'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={`icons-default ${svgClassName}`}
    aria-hidden='true'
    focusable='false'>
    {children}
  </svg>
);

const CloseIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <line x1='18' y1='6' x2='6' y2='18'></line>
    <line x1='6' y1='6' x2='18' y2='18'></line>
  </IconWrapper>
);

const MinimizeIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <polyline points='4 14 10 14 10 20'></polyline>
    <polyline points='20 10 14 10 14 4'></polyline>
    <line x1='14' y1='10' x2='21' y2='3'></line>
    <line x1='3' y1='21' x2='10' y2='14'></line>
  </IconWrapper>
);

const ClockIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <circle cx='12' cy='12' r='10'></circle>
    <polyline points='12 6 12 12 16 14'></polyline>
  </IconWrapper>
);

const CalendarIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
    <line x1='16' y1='2' x2='16' y2='6'></line>
    <line x1='8' y1='2' x2='8' y2='6'></line>
    <line x1='3' y1='10' x2='21' y2='10'></line>
  </IconWrapper>
);

const QuestionMarkIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <path d='M442.616-369.231q0-58.923 15.654-95 15.654-36.076 64.347-78 40.692-35.461 54.153-59.5 13.462-24.038 13.462-53.577 0-44.154-31.616-72.885t-80.924-28.731q-37.385 0-67.5 19.538-30.116 19.538-45.962 61.461l-65.998-28.076q23.308-59.461 72.269-90.806 48.961-31.346 107.191-31.346 80.923 0 132.692 47.654 51.768 47.653 51.768 121.73 0 38.923-17.346 73.807-17.346 34.885-60.73 73.731-44.077 38.769-55.5 64.346-11.424 25.577-12.424 75.654h-73.536Zm35.076 205.23q-21.538 0-36.768-15.231-15.23-15.23-15.23-36.768t15.23-36.768q15.23-15.231 36.768-15.231t36.768 15.231q15.231 15.23 15.231 36.768t-15.231 36.768q-15.23 15.231-36.768 15.231Z' />
  </IconWrapper>
);

const StarIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'></polygon>
  </IconWrapper>
);

const InfoIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <circle cx='12' cy='12' r='10'></circle>
    <line x1='12' y1='16' x2='12' y2='12'></line>

    <circle cx='12' cy='8' r='.3'></circle>
  </IconWrapper>
);

const PlusIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <line x1='12' y1='5' x2='12' y2='19'></line>
    <line x1='5' y1='12' x2='19' y2='12'></line>
  </IconWrapper>
);

const HelpIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <circle cx='12' cy='12' r='10'></circle>
    <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'></path>
    <line x1='12' y1='17' x2='12.01' y2='17'></line>
  </IconWrapper>
);

<polyline points='15 18 9 12 15 6'></polyline>;

const ChevronLefttIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <polyline points='15 18 9 12 15 6'></polyline>;
  </IconWrapper>
);

const ChevronRightIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <polyline points='9 18 15 12 9 6'></polyline>
  </IconWrapper>
);

const ArrowRightIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <line x1='5' y1='12' x2='19' y2='12'></line>
    <polyline points='12 5 19 12 12 19'></polyline>
  </IconWrapper>
);

const ArrowRightCircleIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <circle cx='12' cy='12' r='10'></circle>
    <polyline points='12 16 16 12 12 8'></polyline>
    <line x1='8' y1='12' x2='16' y2='12'></line>
  </IconWrapper>
);

const TriangleIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
  </IconWrapper>
);

const GridIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <rect x='2' y='3' width='3' height='3'></rect>
    <rect x='10' y='3' width='3' height='3'></rect>
    <rect x='18' y='3' width='3' height='3'></rect>
    <rect x='2' y='11' width='3' height='3'></rect>
    <rect x='10' y='11' width='3' height='3'></rect>
    <rect x='18' y='11' width='3' height='3'></rect>
    <rect x='2' y='19' width='3' height='3'></rect>
    <rect x='10' y='19' width='3' height='3'></rect>
    <rect x='18' y='19' width='3' height='3'></rect>
  </IconWrapper>
);

const ListIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <line x1='8' y1='6' x2='21' y2='6' strokeWidth='2.5'></line>
    <line x1='8' y1='13' x2='21' y2='13' strokeWidth='2.5'></line>
    <line x1='8' y1='20' x2='21' y2='20' strokeWidth='2.5'></line>
    <line x1='3' y1='6' x2='3.01' y2='6' strokeWidth='2.5'></line>
    <line x1='3' y1='13' x2='3.01' y2='13' strokeWidth='2.5'></line>
    <line x1='3' y1='20' x2='3.01' y2='20' strokeWidth='2.5'></line>
  </IconWrapper>
);

const ShuffleIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <polyline points='16 3 21 3 21 8'></polyline>
    <line x1='4' y1='20' x2='21' y2='3'></line>
    <polyline points='21 16 21 21 16 21'></polyline>
    <line x1='15' y1='15' x2='21' y2='21'></line>
    <line x1='4' y1='4' x2='9' y2='9'></line>
  </IconWrapper>
);

const SortIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <g>
      <polygon points='5 6 8 2 11 6'></polygon>
      <line x1='8' y1='6' x2='8' y2='16' strokeWidth='2'></line>
    </g>
    <g>
      <polygon points='19 19 16 23 13 19'></polygon>
      <line x1='16' y1='9' x2='16' y2='19' strokeWidth='2'></line>
    </g>
  </IconWrapper>
);

const NotAllowedIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <circle cx='12' cy='12' r='11'></circle>
    <line x1='4.5' y1='4' x2='20' y2='19.5'></line>
  </IconWrapper>
);

const EyeIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
    <circle cx='12' cy='12' r='3'></circle>
  </IconWrapper>
);

const EyeOffIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
    <line x1='1' y1='1' x2='23' y2='23'></line>
  </IconWrapper>
);

const LockIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect>
    <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
  </IconWrapper>
);

const UserIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
    <circle cx='12' cy='7' r='4'></circle>
  </IconWrapper>
);

const CheckIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <polyline points='20 6 9 17 4 12'></polyline>
  </IconWrapper>
);

const TrashIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <polyline points='3 6 5 6 21 6'></polyline>
    <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
    <line x1='10' y1='11' x2='10' y2='17'></line>
    <line x1='14' y1='11' x2='14' y2='17'></line>
  </IconWrapper>
);

const EditIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
    <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
  </IconWrapper>
);

const FilterIcon = ({ width, height, svgClassName }) => (
  <IconWrapper width={width} height={height} svgClassName={svgClassName}>
    <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3'></polygon>
  </IconWrapper>
);

const iconsMap = {
  clock: ClockIcon,
  calendar: CalendarIcon,
  questionMark: QuestionMarkIcon,
  star: StarIcon,
  info: InfoIcon,
  plus: PlusIcon,
  close: CloseIcon,
  help: HelpIcon,
  chevronLeft: ChevronLefttIcon,
  chevronRight: ChevronRightIcon,
  arrowRight: ArrowRightIcon,
  arrowRightCircle: ArrowRightCircleIcon,
  minimize: MinimizeIcon,
  triangle: TriangleIcon,
  grid: GridIcon,
  list: ListIcon,
  shuffle: ShuffleIcon,
  sort: SortIcon,
  notAllowed: NotAllowedIcon,
  eye: EyeIcon,
  eyeOff: EyeOffIcon,
  lock: LockIcon,
  user: UserIcon,
  check: CheckIcon,
  trash: TrashIcon,
  edit: EditIcon,
  filter: FilterIcon,
};

// All the icons are wrapped with an svg element which has a standard viewbox since all icons come from feathericons.com
// The component takes a "name" prop which desides which icon to render from the map object
// plus a width and a height for HTML so the browser knows how to calculate the layout and a CSS className
// for each individual icon if further customization is needed

////// Caution!!! //////
// The svg element has a default class of "icons" applied to it which is located in the index.scss folder
// All props must be strings, name is required

const Icons = memo(function Icons({
  name,
  width = '22',
  height = '22',
  svgClassName = null,
}) {
  // Type checking2
  const checkIfString = (value, strName) => {
    if (typeof value === 'string' || value instanceof String) {
      return value;
    } else {
      console.error(
        `Icons Component "${strName}" prop only accepts Strings, your value was coerced into a String`
      );
      return String(value);
    }
  };

  const validName = checkIfString(name, 'name');
  const validWidth = checkIfString(width, 'width');
  const validHeight = checkIfString(height, 'height');
  let validSvgClassName = svgClassName;
  if (svgClassName !== null) {
    validSvgClassName = checkIfString(svgClassName, 'svgClassName');
  }

  let Component;
  if (Object.hasOwn(iconsMap, validName)) {
    Component = iconsMap[validName];
  } else {
    const iconsMapKeys = Object.keys(iconsMap).join('", "');
    console.error(
      `Icons Component "name" prop is required and only accepts the values ["${iconsMapKeys}"] `
    );
    // eslint-disable-next-line react/display-name
    Component = () => null;
  }
  return (
    <Component
      width={validWidth}
      height={validHeight}
      svgClassName={validSvgClassName}
    />
  );
});

export default Icons;
