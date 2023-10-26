import Link from 'next/link';

export const NotFound = () => {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      <Link className="underline" href="/">
        Home
      </Link>
    </>
  );
};
