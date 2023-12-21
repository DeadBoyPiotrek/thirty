import React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { AiFillHeart } from 'react-icons/ai';
import Image from 'next/image';

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
      <div className="text-xl text-brandPurple-500 self-start flex gap-1 font-medium items-center ">
        {likes.length > 0 ? (
          <>
            <span className="">
              <AiFillHeart />
            </span>
            <span>{likes.length}</span>
          </>
        ) : null}
      </div>
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        className="data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-md bg-brandBlack-light p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
        sideOffset={5}
      >
        <div className="max-h-44 overflow-y-scroll">
          {likes.map(like => (
            <div key={like.id} className="flex items-center gap-2">
              <Image
                src={`${
                  like.user.imageUrl || `/images/profile-user-default.svg`
                }`}
                alt="avatar"
                className=" w-4 h-4 rounded-full overflow-hidden object-cover "
                width={40}
                height={40}
              />
              <p>{like.user.name}</p>
            </div>
          ))}
        </div>
        <HoverCard.Arrow className="fill-brandBlack-light" />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);
