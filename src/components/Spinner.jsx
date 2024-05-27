import '../styles/Spinner.scss';

const Spinner = ({ busy = false }) => {
  return (
    <div className='spinner-wrapper'>
      <div className='spinner' aria-busy={busy}></div>
    </div>
  );
};

export default Spinner;
