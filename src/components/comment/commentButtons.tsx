'use client';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { CommentEditForm } from './commentEditForm';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';

interface CommentProps {
  id: number;
  content: string;
}

export const CommentButtons = ({ content, id }: CommentProps) => {
  let [open, setOpen] = useState(false);

  const utils = trpc.useUtils();
  const { mutate: deletePostMutation, isLoading } =
    trpc.post.deleteComment.useMutation({
      onSettled: () => {
        utils.post.loadMoreComments.invalidate();
      },
    });

  return (
    <div className="flex gap-2 self-end ">
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Button asChild>
          <Button
            className="text-lg  border-brandBlack-light"
            variant={'ghost'}
            aria-label="edit"
          >
            <MdModeEditOutline />
          </Button>
        </Modal.Button>
        <Modal.Content>
          Edit Comment
          <CommentEditForm
            content={content}
            id={id}
            closeModal={() => setOpen(false)}
          />
        </Modal.Content>
      </Modal>

      <Button
        className="text-lg  border-brandBlack-light"
        variant={'ghost'}
        aria-label="delete"
        onClick={() => deletePostMutation({ id })}
        isLoading={isLoading}
      >
        <MdDeleteForever />
      </Button>
    </div>
  );
};
