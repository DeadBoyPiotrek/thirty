import Image from 'next/image';

type Quest = {
  id: string;
  title: string;
  content: string;
  datePublished: string;
  image: string;
};
export const QuestList = ({ quests }: { quests: Quest[] }) => {
  return (
    <div className="border inline-block">
      {quests.map(quest => (
        <div key={quest.id} className="quest w-80 ">
          <Image
            src={quest.image}
            alt={`image for ${quest.title}`}
            width={400}
            height={300}
          />
          <h2>{quest.title}</h2>
          <p>{quest.content}</p>
          <small>{quest.datePublished}</small>
        </div>
      ))}
    </div>
  );
};
