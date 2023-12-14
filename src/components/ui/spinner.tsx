import { ImSpinner2 } from 'react-icons/im';
export const Spinner = () => {
  return (
    <div role="status">
      <ImSpinner2 className="animate-spin " />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
