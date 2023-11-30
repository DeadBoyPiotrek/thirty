import Image from 'next/image';

import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type Quest = {
  id: number;
  title: string;
  content: string;
  datePublished: Date;
  imageUrl: string | null;
  userId: number;
};
export const QuestList = ({ quests }: { quests: Quest[] }) => {
  return (
    <div
      className="flex flex-wrap gap-3 xl:w-[1180px] 
    lg:w-[785px]  md:w-[384px] 
    "
    >
      {quests.map(quest => (
        <Link
          key={quest.id}
          href={`/${quest.userId}/quests/${quest.id}`}
          className={cn(
            'w-96 max-h-96 rounded-lg bg-brandBlack-medium flex flex-col',
            !quest.imageUrl && 'p-4'
          )}
        >
          {quest.imageUrl ? (
            <Image
              src={quest.imageUrl}
              alt={`imageUrl for ${quest.title}`}
              width={400}
              height={300}
              className="h-52 object-cover rounded-t-lg  "
            />
          ) : null}
          <time
            className="pt-2  pl-2 text-sm block "
            dateTime={quest.datePublished.toISOString()}
          >
            {format(quest.datePublished, 'MMM dd, yyyy')}
          </time>

          <p className="text-2xl text-brandPurple-500 break-words pt-2 pl-2 overflow-hidden ">
            {quest.title}
          </p>

          <p className="pt-2 pl-2 break-words overflow-hidden">
            {quest.content}
          </p>
        </Link>
      ))}
    </div>
  );
};
