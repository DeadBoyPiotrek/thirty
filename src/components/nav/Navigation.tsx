import Link from 'next/link';
import { HiHome } from 'react-icons/hi';
import { FaUserFriends, FaStar } from 'react-icons/fa';
import { Avatar, AvatarFallback } from '@ui/avatar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';

export const Navigation = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user) {
    return (
      <nav className="flex justify-between px-10 py-4 m-4 max-w-7xl w-full rounded-xl items-center text-brandGray bg-brandBlack-light ">
        <Link href="/" className="font-extrabold text-4xl text-brandPurple-500">
          Thirty
        </Link>

        <span className="flex text-4xl gap-x-16 ml-[-60px]">
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
          <Link href={`/${user.id}/quests`}>
            <FaStar
              aria-hidden="true"
              className="transition hover:scale-125 ease-in-out duration-300"
            />
          </Link>
        </span>

        <Link href={`/${user.id}`}>
          <Avatar
            src={`${user.imagee || `/images/profile-user-default`} `}
            alt="avatar"
            className="mt-5 w-max"
          />
        </Link>
      </nav>
    );
  }
};
