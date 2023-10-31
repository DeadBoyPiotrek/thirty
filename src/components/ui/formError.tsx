export const FormError = ({ error }: { error: string | undefined }) => {
  if (!error) return null;
  return (
    <div className="rounded-md text-red-400">
      <p>{error}</p>
    </div>
  );
};
