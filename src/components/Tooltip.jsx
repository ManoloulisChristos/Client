import '../styles/Tooltip.scss';

// Problem!!!
// For some reason that i do not know the tooltip is dropping a significant amount of frames when it animates in and out
// The reason is uknown, the only things that animate are opacity and transforms translate
// The cpu is not loaded, the task that runs before the animation starts is 8ms at most, which is under 16ms.
// I can not find the reason why this is happening so i leave it as is for now.

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

// Best practice: Prefer using distinct labels as text eg: text in a button rather than using labeledby and use the
// tooltip only as a descriptor with aria-describedby for extra information

// -- An exception to this is: when there is a button with only an image and information must be provided both for
// screen readers and as a description for sighted users, using just a label that is visually hidden is not enough
// so the tooltip is used instead to cover both cases

const Tooltip = ({ children, id = '', text, tip, hasWrapper }) => {
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

  const tooltip = (
    <div
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
        <div className='tooltip-wrapper'>
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
