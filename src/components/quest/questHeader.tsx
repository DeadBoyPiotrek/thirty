'use client';
import Image from 'next/image';
import { QuestButtons } from '@/components/quest/questButtons';
import { trpc } from '@/app/_trpc/client';
import { serverClient } from '@/app/_trpc/serverClient';
interface QuestHeaderProps {
  initialQuest: Awaited<
    ReturnType<(typeof serverClient)['quest']['getSingleQuestWithPosts']>
  >;
  userId: number;
  questId: number;
}

export const QuestHeader = ({
  initialQuest,
  questId,
  userId,
}: QuestHeaderProps) => {
  const { data: quest } = trpc.quest.getSingleQuestWithPosts.useQuery(
    {
      userId,
      questId,
    },
    {
      initialData: initialQuest,
      refetchOnMount: false,
    }
  );

  if (!quest) {
    return <h1>Quest not found 💔</h1>;
  }
  return (
    <>
      <div className="flex gap-2 justify-between items-center">
        <h1 className="font-bold text-brandPurple-500 text-4xl max-w-3xl break-words">
          {quest.title}
        </h1>
        <QuestButtons quest={quest} />
      </div>
      <p className="max-w-4xl break-words py-2">{quest.content}</p>
      {quest.imageUrl ? (
        <Image
          src={quest.imageUrl}
          alt={quest.title}
          width={800}
          height={800}
          className="w-full h-full rounded-lg"
        />
      ) : null}
    </>
  );
};
