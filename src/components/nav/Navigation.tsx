import Link from 'next/link';
import { HiHome } from 'react-icons/hi';
import { FaUserFriends, FaStar } from 'react-icons/fa';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';

export const Navigation = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (user) {
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
          <Avatar>
            {user.image ? (
              <Image
                src={user.image}
                alt="Avatar"
                width={40}
                height={40}
                className="w-10 rounded-full hover:scale-115 transition ease-in-out duration-300"
              />
            ) : (
              <AvatarFallback userName={!user.name ? 'Profile' : user?.name} />
            )}
          </Avatar>
        </Link>
      </nav>
    );
  }
};
