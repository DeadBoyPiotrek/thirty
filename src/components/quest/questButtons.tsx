'use client';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import { Button } from '../ui/button';
import { Modal } from '../ui/modalOld';
import { QuestEditForm } from './questEditForm';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { deleteImage } from '@/lib/helpers/images/deleteImage';
import { useRouter } from 'next/navigation';
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
  const [mounted, setMounted] = useState(false);
  const closeModal = () => {
    setMounted(false);
  };

  const mutation = trpc.quest.deleteQuest.useMutation({
    onSettled: () => {
      utils.quest.getQuests.refetch();
    },
  });

  const deleteQuest = () => {
    if (quest.imageName) {
      deleteImage({ folderName: 'quests', imageName: quest.imageName });
    }
    mutation.mutate({ questId: quest.id });
    router.push('/');
  };

  return (
    <div className="flex gap-2 h-12">
      <Modal mounted={mounted}>
        <QuestEditForm quest={quest} closeModal={closeModal} />
      </Modal>
      <Button
        className="text-lg px-4 border-brandBlack-light"
        variant={'dark'}
        aria-label="edit"
        onClick={() => setMounted(true)}
      >
        <MdModeEditOutline />
      </Button>
      <Button
        className="text-lg px-4 border-brandBlack-light"
        variant={'dark'}
        aria-label="delete"
        onClick={deleteQuest}
      >
        <MdDeleteForever />
      </Button>
    </div>
  );
};
