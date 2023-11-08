'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { useState } from 'react';
import { PostEditForm } from './postEditForm';
import { MdModeEditOutline } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { trpc } from '@/app/_trpc/client';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';
interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    datePublished: Date;
    user: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
    quest: {
      id: string;
      title: string;
    };
  };
}

export const Post = ({ post }: PostProps) => {
  const mutation = trpc.post.deletePost.useMutation();
  const [mounted, setMounted] = useState(false);
  const closeModal = () => {
    setMounted(false);
  };

  return (
    <div key={post.id} className="border ">
      <Link href={`/${post.user.id}`}>
        <Avatar>
          {post.user.imageUrl ? (
            <Image
              src={post.user.imageUrl}
              alt="Avatar"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full hover:scale-115 transition ease-in-out duration-300 object-cover"
            />
          ) : (
            <AvatarFallback
              userName={!post.user.name ? 'Profile' : post.user?.name}
            />
          )}
        </Avatar>
      </Link>
      <div>{post.user.name}</div>
      <div>{format(post.datePublished, 'MMM dd, yyyy')}</div>
      <Modal mounted={mounted}>
        <PostEditForm post={post} closeModal={closeModal} />
      </Modal>
      <div className="flex gap-2 p-2">
        <Button aria-label="edit" onClick={() => setMounted(true)}>
          <MdModeEditOutline />
        </Button>
        <Button
          aria-label="delete"
          onClick={() => mutation.mutate({ id: post.id })}
        >
          <MdDeleteForever />
        </Button>
      </div>

      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {post.imageUrl ? (
        <Image src={post.imageUrl} alt={post.title} width={500} height={500} />
      ) : null}
    </div>
  );
};
