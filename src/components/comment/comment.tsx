'use client';

import { formatDistance } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { CommentButtons } from './commentButtons';
import { useSession } from 'next-auth/react';

interface CommentProps {
  comment: {
    id: number;
    content: string;
    datePublished: Date;
    user: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
  };
}

export const Comment = ({ comment }: CommentProps) => {
  const { data: session } = useSession();
  return (
    <div className="px-2 py-1 rounded-md bg-brandBlack-light flex flex-col w-full leading-5">
      <div className="flex items-center gap-2 w-full justify-between">
        <span className="flex items-center gap-2">
          <Link
            href={`/${comment.user.id}`}
            className="flex items-center gap-2 "
          >
            <Image
              src={`${
                comment.user.imageUrl || `/images/profile-user-default.svg`
              }`}
              alt="avatar"
              className=" w-8 h-8 rounded-full overflow-hidden object-cover "
              width={30}
              height={30}
            />
            <p>{comment.user.name}</p>
          </Link>
          <time
            className="text-xs"
            dateTime={comment.datePublished.toISOString()}
          >
            {formatDistance(comment.datePublished, new Date(), {
              addSuffix: true,
            })}
          </time>
        </span>

        {comment.user.id === session?.user.id ? (
          <CommentButtons id={comment.id} content={comment.content} />
        ) : null}
      </div>
      <p className="px-2 sm:ml-10 break-words whitespace-pre-wrap ">
        {comment.content}
      </p>
    </div>
  );
};
