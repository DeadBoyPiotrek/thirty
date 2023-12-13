'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { forwardRef } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';
import { PostButtons } from './postButtons';

import { useSession } from 'next-auth/react';
interface PostProps {
  post: {
    id: number;
    title: string;
    content: string;
    imageName: string | null;
    imageUrl: string | null;
    datePublished: Date;
    user: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
    quest: {
      id: number;
      title: string;
    };
  };
}

export const Post = forwardRef<HTMLDivElement, PostProps>(({ post }, ref) => {
  const { data: session } = useSession();

  return (
    <div
      ref={ref}
      key={post.id}
      className="bg-brandBlack-medium rounded-lg w-full"
    >
      <div className="flex p-5 justify-between">
        <div className="flex gap-2 items-center ">
          <Link href={`/${post.user.id}`}>
            <Image
              src={`${
                post.user.imageUrl || `/images/profile-user-default.svg`
              }`}
              alt="avatar"
              className=" w-10 h-10 rounded-full overflow-hidden object-cover "
              width={40}
              height={40}
            />
          </Link>
          <div>
            <div className="flex">
              <p>{post.user.name}</p> &nbsp;in&nbsp;
              <Link
                className="overflow-hidden max-w-md max-h-6"
                href={`/${post.user.id}/quests/${post.quest.id}`}
              >
                {post.quest.title}
              </Link>
            </div>
            <time
              className="text-sm"
              dateTime={post.datePublished.toISOString()}
            >
              {format(post.datePublished, 'HH:mm MMM dd ')}
            </time>
          </div>
        </div>

        {session?.user.id === post.user.id ? <PostButtons post={post} /> : null}
      </div>

      <h2 className="text-lg text-brandPurple-300 px-5 break-words">
        {post.title}
      </h2>
      <p className="px-5 break-words">{post.content}</p>
      <div className="flex justify-center">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={500}
            height={500}
            className="w-auto h-auto"
          />
        ) : null}
      </div>
      <div className="p-5 flex justify-center gap-5 ">
        <Button
          className="flex items-center font-medium gap-2 "
          aria-label="like"
          variant={'ghost'}
        >
          <AiFillHeart />
          Like
        </Button>
        <Button
          className="flex items-center font-medium gap-2 "
          aria-label="comment"
          variant={'ghost'}
        >
          <FaComment /> Comment
        </Button>
      </div>
    </div>
  );
});

Post.displayName = 'Post';
