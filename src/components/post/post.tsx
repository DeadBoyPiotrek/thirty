'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { forwardRef } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';
import { PostButtons } from './postButtons';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { PostLikes } from './postLikes';
interface PostProps {
  post: {
    id: number;
    title: string;
    content: string;
    imageName: string | null;
    imageUrl: string | null;
    datePublished: Date;
    likes: Like[];
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
interface Like {
  id: number;
  user: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
}

export const Post = forwardRef<HTMLDivElement, PostProps>(({ post }, ref) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  const { mutate: likeUnlikePost } = trpc.post.likePost.useMutation({
    // TODO is there a better way to do this?
    onMutate: async () => {
      const postId = post.id;

      await utils.post.getFeedPosts.cancel();
      const previousPosts = utils.post.getFeedPosts.getInfiniteData({
        cursor: undefined,
        limit: 3,
      });

      if (previousPosts) {
        utils.post.getFeedPosts.setInfiniteData(
          { cursor: undefined, limit: 3 },
          {
            pages: previousPosts.pages.map(page => {
              return {
                cursor: page.cursor,
                posts: page.posts.map(post => {
                  if (post.id === postId) {
                    //if user already liked the post, unlike it
                    if (
                      post.likes.some(like => like.user.id === session?.user.id)
                    ) {
                      return {
                        ...post,
                        likes: post.likes.filter(
                          like => like.user.id !== session?.user.id
                        ),
                      };
                    }
                    //if user didn't like the post, like it
                    return {
                      ...post,
                      likes: [
                        ...post.likes,
                        {
                          user: {
                            id: session?.user.id as number,
                            name: session?.user.name as string,
                            imageUrl: session?.user.image as string | null,
                          },
                          id: Math.random(),
                        },
                      ],
                    };
                  }

                  return post;
                }),
              };
            }),
            pageParams: previousPosts.pageParams,
          }
        );
      }
    },
  });

  return (
    <div
      ref={ref}
      key={post.id}
      className="bg-brandBlack-medium rounded-lg w-full p-5 flex flex-col gap-2"
    >
      <div className="flex justify-between">
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

      <h2 className="text-lg text-brandPurple-300  break-words">
        {post.title}
      </h2>
      <p className=" break-words">{post.content}</p>
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

      <PostLikes likes={post.likes} />
      <div className="p-2 flex justify-center gap-5 ">
        <Button
          className={`font-medium ${
            post.likes.some(like => like.user.id === session?.user.id)
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
        <Button className="font-medium" aria-label="comment" variant={'ghost'}>
          <span className="flex items-center gap-2">
            <FaComment />
            Comment
          </span>
        </Button>
      </div>
    </div>
  );
});

Post.displayName = 'Post';
