'use client';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { PostEditForm } from './postEditForm';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { deleteImage } from '@/lib/helpers/images/deleteImage';

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

export const PostButtons = ({ post }: PostProps) => {
  let [open, setOpen] = useState(false);

  const utils = trpc.useUtils();
  const mutation = trpc.post.deletePost.useMutation({
    onSettled: () => {
      utils.post.getFeedPosts.invalidate();
      utils.quest.getSingleQuestWithPosts.invalidate();
    },
  });
  const deletePost = () => {
    if (post.imageName) {
      deleteImage({ folderName: 'posts', imageName: post.imageName });
    }
    mutation.mutate({ id: post.id });
  };

  return (
    <div className="flex gap-2 h-12">
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Button asChild>
          <Button
            className="text-lg px-4 border-brandBlack-light"
            variant={'dark'}
            aria-label="edit"
          >
            <MdModeEditOutline />
          </Button>
        </Modal.Button>
        <Modal.Content>
          Edit Post
          <PostEditForm post={post} closeModal={() => setOpen(false)} />
        </Modal.Content>
      </Modal>

      <Button
        className="text-lg px-4 border-brandBlack-light"
        variant={'dark'}
        aria-label="delete"
        onClick={deletePost}
      >
        <MdDeleteForever />
      </Button>
    </div>
  );
};
