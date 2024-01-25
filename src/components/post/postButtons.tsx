'use client';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { PostEditForm } from './postEditForm';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { deleteImage } from '@/lib/helpers/images/deleteImage';
import * as Popover from '@radix-ui/react-popover';
import { SlOptionsVertical } from 'react-icons/sl';
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
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const utils = trpc.useUtils();
  const { mutate: deletePostMutation, isLoading } =
    trpc.post.deletePost.useMutation({
      onSettled: () => {
        utils.post.getFeedPosts.invalidate();
        utils.quest.getSingleQuestWithPosts.invalidate();
      },
    });
  const deletePost = () => {
    if (post.imageName) {
      deleteImage({ folderName: 'posts', imageName: post.imageName });
    }
    deletePostMutation({ id: post.id });
  };

  return (
    <>
      <Popover.Root open={openDropdown} onOpenChange={setOpenDropdown}>
        <Popover.Trigger asChild>
          <button aria-label="post options">
            <SlOptionsVertical />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="flex gap-2 h-14 bg-brandBlack-light rounded-md p-1"
            side="bottom"
          >
            <Button
              className="text-lg px-4 border-brandBlack-light"
              variant={'dark'}
              aria-label="edit"
              onClick={() => setOpen(true)}
            >
              <MdModeEditOutline />
            </Button>
            <Button
              className="text-lg px-4 border-brandBlack-light"
              variant={'dark'}
              aria-label="delete"
              onClick={deletePost}
              isLoading={isLoading}
            >
              <MdDeleteForever />
            </Button>

            <Popover.Arrow className="fill-brandBlack-light" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Button asChild></Modal.Button>
        <Modal.Content>
          Edit Post
          <PostEditForm post={post} closeModal={() => setOpen(false)} />
        </Modal.Content>
      </Modal>
    </>
  );
};
