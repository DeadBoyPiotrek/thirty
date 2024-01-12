import React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
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

export const PostLikes = ({ likes }: PostLikesProps) => (
  <HoverCard.Root openDelay={100}>
    <HoverCard.Trigger asChild>
      <div className="text-xl text-brandPurple-500 self-start flex gap-1 font-medium items-center cursor-pointer">
        {likes.length > 0 ? (
          <>
            <AiFillHeart />

            <span className="">{likes.length}</span>
          </>
        ) : null}
      </div>
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        className="data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-md bg-brandBlack-light p-3 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
        sideOffset={5}
      >
        <div className="max-h-44 overflow-y-scroll flex flex-col gap-2">
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
        <HoverCard.Arrow className="fill-brandBlack-light" />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);
