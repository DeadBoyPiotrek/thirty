'use client';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { CommentEditForm } from './commentEditForm';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import * as Popover from '@radix-ui/react-popover';
import { SlOptionsVertical } from 'react-icons/sl';
interface CommentProps {
  id: number;
  content: string;
}

export const CommentButtons = ({ content, id }: CommentProps) => {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const utils = trpc.useUtils();
  const { mutate: deletePostMutation, isLoading } =
    trpc.post.deleteComment.useMutation({
      onSettled: () => {
        utils.post.loadMoreComments.invalidate();
      },
    });

  return (
    <>
      <Popover.Root open={openDropdown} onOpenChange={setOpenDropdown}>
        <Popover.Trigger asChild>
          <button aria-label="comment options">
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
              variant="dark"
              aria-label="edit"
              onClick={() => setOpen(true)}
            >
              <MdModeEditOutline />
            </Button>
            <Button
              className="text-lg px-4 border-brandBlack-light"
              variant="dark"
              aria-label="delete"
              onClick={() => deletePostMutation({ id })}
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
          Edit Comment
          <CommentEditForm
            content={content}
            id={id}
            closeModal={() => setOpen(false)}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};
