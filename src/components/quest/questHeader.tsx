'use client';
import Image from 'next/image';
import { QuestButtons } from '@/components/quest/questButtons';
import { trpc } from '@/app/_trpc/client';
import { serverClient } from '@/app/_trpc/serverClient';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const loggedUserId = session?.user?.id;
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
      <div className="flex gap-2 justify-between">
        <h1 className="font-bold text-brandPurple-500 text-4xl break-words">
          {quest.title}
        </h1>
        {loggedUserId === userId ? <QuestButtons quest={quest} /> : null}
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
