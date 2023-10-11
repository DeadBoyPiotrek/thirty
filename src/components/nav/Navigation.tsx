import Link from 'next/link';
import { HiHome } from 'react-icons/hi';
import { FaUserFriends, FaStar } from 'react-icons/fa';
import { Avatar } from '../ui/avatar';

export const Navigation = () => {
  const imgUrl = 'https://github.com/DeadBoyPiotrek.png';

  return (
    <nav className="flex justify-between px-10 py-4 m-4 max-w-7xl w-full  backdrop-blur-md rounded-xl items-center border border-neutral-800 shadow-md shadow-neutral-900/50 ">
      <p className="font-extrabold text-4xl">Thirty</p>

      <span className="flex text-4xl gap-x-16 ">
        <Link href="/">
          <HiHome
            aria-hidden="true"
            className="transition hover:scale-125 ease-in-out duration-300"
          />
        </Link>

        <Link href="/friends">
          <FaUserFriends
            aria-hidden="true"
            className="transition hover:scale-125 ease-in-out duration-300 "
          />
        </Link>
        <Link href="/quests">
          <FaStar
            aria-hidden="true"
            className="transition hover:scale-125 ease-in-out duration-300"
          />
        </Link>
      </span>

      <Link href="/profile">
        {/* <FaUser
          aria-hidden="true"
          className="transition hover:scale-125 ease-in-out duration-300"
        /> */}

        <Avatar imgUrl={imgUrl} />
      </Link>
    </nav>
  );
};
