import Image from 'next/image';

import Link from 'next/link';
import { format } from 'date-fns';

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
    <div className="flex gap-3 flex-wrap justify-center ">
      {quests.map(quest => (
        <Link
          key={quest.id}
          href={`/${quest.userId}/quests/${quest.id}`}
          className="w-96 max-h-96 rounded-lg bg-brandBlack-medium border-2"
        >
          {quest.imageUrl ? (
            <Image
              src={quest.imageUrl}
              alt={`imageUrl for ${quest.title}`}
              width={400}
              height={300}
              className="h-52 object-cover rounded-t-lg "
            />
          ) : null}
          <time
            className="pt-2  pl-2 text-sm block"
            dateTime={quest.datePublished.toISOString()}
          >
            {format(quest.datePublished, 'MMM dd, yyyy')}
          </time>

          <p className="text-2xl bg-red-50 text-brandPurple-500 break-words pt-2 pl-2 h-full overflow-hidden text-ellipsis ">
            {quest.title}
          </p>
          {/* <p className="pt-2 pl-2 break-words overflow-hidden text-ellipsis">
            {quest.content}
          </p> */}
        </Link>
      ))}
    </div>
  );
};
