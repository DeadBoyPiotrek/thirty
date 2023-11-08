import Image from 'next/image';
import { QuestForm } from '@/components/quest/questForm';
import Link from 'next/link';
import { format } from 'date-fns';
type Post = {
  id: string;
  title: string;
  content: string;
  datePublished: Date;
  imageUrl: string | null;
};
type Quest = {
  id: string;
  title: string;
  content: string;
  datePublished: Date;
  imageUrl: string | null;
  userId: string;
  posts: Post[];
};
export const QuestList = ({ quests }: { quests: Quest[] }) => {
  return (
    <div className="flex flex-col gap-2">
      <QuestForm />
      {quests.map(quest => (
        <Link
          key={quest.id}
          href={`/${quest.userId}/quests/${quest.id}`}
          className="w-max border block"
        >
          {quest.imageUrl ? (
            <Image
              src={quest.imageUrl}
              alt={`imageUrl for ${quest.title}`}
              width={400}
              height={300}
            />
          ) : null}

          <h2>{quest.title}</h2>
          <p>{quest.content}</p>
          <small>{format(quest.datePublished, 'MMM dd, yyyy')}</small>
        </Link>
      ))}
    </div>
  );
};
