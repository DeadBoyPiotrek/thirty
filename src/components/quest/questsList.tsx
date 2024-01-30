'use client';
import Image from 'next/image';

import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';

type Quest = {
  id: number;
  title: string;
  content: string;
  datePublished: Date;
  imageUrl: string | null;
  userId: number;
};
export const QuestList = ({
  initQuests,
  userId,
}: {
  initQuests: Quest[];
  userId: number;
}) => {
  const { data } = trpc.quest.getQuests.useQuery(
    { userId },
    {
      initialData: initQuests,
    }
  );

  return (
    <div
      className="flex flex-wrap justify-center gap-3 xl:w-[1180px] 
    lg:w-[785px] md:w-[384px] md:justify-start w-full
    "
    >
      {data.map(quest => (
        <Link
          key={quest.id}
          href={`/${quest.userId}/quests/${quest.id}`}
          className={cn(
            'max-w-sm w-full max-h-96 rounded-lg bg-brandBlack-medium flex flex-col pb-2 ',
            !quest.imageUrl && 'p-4'
          )}
        >
          {quest.imageUrl ? (
            <Image
              src={quest.imageUrl}
              alt={`imageUrl for ${quest.title}`}
              width={400}
              height={300}
              className="h-52 object-cover rounded-t-lg"
            />
          ) : null}
          <time
            className="pt-2  pl-2 text-sm block "
            dateTime={quest.datePublished.toISOString()}
          >
            {format(quest.datePublished, 'MMM dd, yyyy')}
          </time>

          <p
            className={cn(
              'text-2xl text-brandPurple-500 break-words pt-2 pl-2 line-clamp-2',
              !quest.imageUrl && 'line-clamp-4'
            )}
          >
            {quest.title}
          </p>

          <p
            className={cn(
              'pt-2 pl-2 break-words line-clamp-2',
              !quest.imageUrl && 'line-clamp-4'
            )}
          >
            {quest.content}
          </p>
        </Link>
      ))}
    </div>
  );
};
