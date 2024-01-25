'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { forwardRef, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';
import { PostButtons } from './postButtons';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { PostLikes } from './postLikes';
import { Comments } from '../comment/comments';
interface PostProps {
  post: {
    id: number;
    title: string;
    content: string;
    imageName: string | null;
    imageUrl: string | null;
    datePublished: Date;
    likes: Like[];
    comments: Comment[];
    user: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
    quest: {
      id: number;
      title: string;
    };
    commentsAmount: number;
  };
}
interface Like {
  id: number;
  user: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
}

interface Comment {
  id: number;
  content: string;
  datePublished: Date;
  user: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
}

export const Post = forwardRef<HTMLDivElement, PostProps>(({ post }, ref) => {
  const { data: session } = useSession();

  // TODO is this the best way to handle likes?
  const [likes, setLikes] = useState(post.likes);
  const [isCommentFormOpen, setCommentFormOpen] = useState(false);
  const { mutate: likeUnlikePost } = trpc.post.likePost.useMutation({
    onMutate: async () => {
      // Optimistically update the likes
      setLikes(currentLikes => {
        const isLiked = currentLikes.some(
          like => like.user.id === session?.user.id
        );
        if (isLiked) {
          // Remove like
          return currentLikes.filter(like => like.user.id !== session?.user.id);
        } else {
          // Add like
          return [
            ...currentLikes,
            {
              user: {
                id: session?.user.id as number,
                name: session?.user.name as string,
                imageUrl: session?.user.image as string | null,
              },
              id: Math.random(), // temporary ID until real ID is fetched from the server
            },
          ];
        }
      });
    },
    // Handle actual response/error here if needed
  });

  return (
    <div
      ref={ref}
      key={post.id}
      className="bg-brandBlack-medium rounded-lg w-full p-2 sm:p-5 flex flex-col gap-2 "
    >
      <div className="flex justify-between ">
        <div className="flex gap-2 items-center">
          <Link href={`/${post.user.id}`}>
            <Image
              src={`${
                post.user.imageUrl || `/images/profile-user-default.svg`
              }`}
              alt="avatar"
              className=" w-10 h-10 rounded-full object-cover"
              width={40}
              height={40}
            />
          </Link>
          <div>
            <div className="sm:flex gap-1 w-full border">
              <p>{post.user.name}</p>

              <span className="flex gap-1">
                in
                <Link
                  className="text-brandPurple-100 border break-words  "
                  href={`/${post.user.id}/quests/${post.quest.id}`}
                >
                  {post.quest.title}
                </Link>
              </span>
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

      <h2 className="text-lg text-brandPurple-300  break-words ">
        {post.title}
      </h2>
      <p className="break-words whitespace-pre-wrap">{post.content}</p>
      <div className="flex justify-center  ">
        {post.imageUrl ? (
          <div className="max-h-screen overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={500}
              height={500}
              className="w-auto h-auto "
            />
          </div>
        ) : null}
      </div>

      <PostLikes likes={likes} />
      <div className=" flex justify-center gap-5 items-center">
        <Button
          className={`font-medium ${
            likes.some(like => like.user.id === session?.user.id)
              ? 'text-brandPurple-500'
              : ''
          }`}
          aria-label="like"
          variant={'ghost'}
          onClick={() => likeUnlikePost({ postId: post.id })}
        >
          <span className="flex items-center gap-2">
            <AiFillHeart />
            Like
          </span>
        </Button>
        <Button
          className="font-medium"
          aria-label="comment"
          variant={'ghost'}
          onClick={() => setCommentFormOpen(!isCommentFormOpen)}
        >
          <span className="flex items-center gap-2">
            <FaComment />
            Comment
          </span>
        </Button>
      </div>
      <Comments
        postId={post.id}
        initialComments={post.comments}
        initialAmount={post.commentsAmount}
        formOpen={isCommentFormOpen}
      />
    </div>
  );
});

Post.displayName = 'Post';
