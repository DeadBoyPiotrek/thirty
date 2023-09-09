import Link from 'next/link';

export const Navigation = () => {
  return (
    <nav className="flex justify-center">
      <ul className="flex flex-row gap-2">
        <li>
          {/* input */}
          <Link href="/Search">Search</Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/Profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};
