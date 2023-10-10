import Link from 'next/link';
import { HiHome } from 'react-icons/hi';
import { FaUserFriends, FaStar, FaUser } from 'react-icons/fa';
export const Navigation = () => {
  return (
    <nav className="flex justify-between p-4 max-w-7xl w-full border rounded-lg">
      <Link href="/">
        <p className="font-extrabold text-4xl ">Thirty</p>
      </Link>
      <span className="flex text-4xl gap-5">
        <Link href="/">
          <HiHome aria-hidden="true" />
        </Link>

        <Link href="/friends">
          <FaUserFriends aria-hidden="true" />
        </Link>

        <Link href="/quests">
          <FaStar aria-hidden="true" />
        </Link>
      </span>

      <Link href="/profile">
        <FaUser aria-hidden="true" />
      </Link>
    </nav>
  );
};
