import { serverClient } from './_trpc/serverClient';
import Image from 'next/image';

type Quest = {
  id: string;
  title: string;
  content: string;
  datePublished: string;
  image: string;
};

const QuestList = ({ quests }: { quests: Quest[] }) => {
  return (
    <div className="border inline-block">
      {quests.map(quest => (
        <div key={quest.id} className="quest w-80 ">
          <Image src={quest.image} alt={quest.title} width={400} height={300} />
          <h2>{quest.title}</h2>
          <p>{quest.content}</p>
          <small>{quest.datePublished}</small>
        </div>
      ))}
    </div>
  );
};

export default async function Home() {
  const quests = await serverClient.quest.getMyQuests();

  return (
    <div>{quests && quests.length > 0 && <QuestList quests={quests} />}</div>
  );
}
