import * as Popover from '@radix-ui/react-popover';
import { AiFillHeart } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';

interface PostLikesProps {
  likes: Like[];
}

interface Like {
  id: number;
  user: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
}

export const PostLikes = ({ likes }: PostLikesProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div className="text-xl text-brandPurple-500 self-start flex gap-1 font-medium items-center cursor-pointer">
          {likes.length > 0 ? (
            <>
              <AiFillHeart />

              <span className="">{likes.length}</span>
            </>
          ) : null}
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="rounded-md bg-brandBlack-light p-3 "
          sideOffset={5}
        >
          <div className="max-h-44 overflow-y-scroll flex flex-col gap-2 ">
            {likes.map(like => (
              <Link
                key={like.id}
                className="flex items-center hover:underline"
                href={`/${like.user.id}`}
              >
                <Image
                  src={`${
                    like.user.imageUrl || `/images/profile-user-default.svg`
                  }`}
                  alt="avatar"
                  className=" w-7 h-7 rounded-full overflow-hidden object-cover mr-2"
                  width={40}
                  height={40}
                />
                <p>{like.user.name}</p>
              </Link>
            ))}
          </div>
          <Popover.Arrow className="fill-brandBlack-light" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
