'use client';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import { Button } from '../ui/button';
import { Modal } from '@ui/modal';
import { QuestEditForm } from './questEditForm';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { deleteImage } from '@/lib/helpers/images/deleteImage';
import { useRouter } from 'next/navigation';
import * as Popover from '@radix-ui/react-popover';
import { SlOptionsVertical } from 'react-icons/sl';
interface QuestProps {
  quest: {
    id: number;
    title: string;
    content: string;
    imageName: string | null;
    imageUrl: string | null;
  };
}
export const QuestButtons = ({ quest }: QuestProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const { mutate: deleteQuestMutation, isLoading } =
    trpc.quest.deleteQuest.useMutation({
      onSettled: () => {
        utils.quest.getQuests.refetch();
      },
    });

  const deleteQuest = () => {
    if (quest.imageName) {
      deleteImage({ folderName: 'quests', imageName: quest.imageName });
    }
    deleteQuestMutation({ questId: quest.id });
    router.push('/');
  };

  return (
    <div className="flex gap-2 h-12 mt-2">
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
              onClick={deleteQuest}
              isLoading={isLoading}
            >
              <MdDeleteForever />
            </Button>{' '}
            <Popover.Arrow className="fill-brandBlack-light" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <QuestEditForm quest={quest} closeModal={() => setOpen(false)} />
        </Modal.Content>
      </Modal>
    </div>
  );
};
