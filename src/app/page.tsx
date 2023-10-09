import { TopicForm } from '@/components/topic/topicForm';

import { serverClient } from './_trpc/serverClient';
import Image from 'next/image';

type Topic = {
  id: string;
  title: string;
  content: string;
  datePublished: string;
  image: string;
};

const TopicList = ({ topics }: { topics: Topic[] }) => {
  return (
    <div className="border inline-block">
      {topics.map(topic => (
        <div key={topic.id} className="topic">
          <Image src={topic.image} alt={topic.title} width={400} height={300} />
          <h2>{topic.title}</h2>
          <p>{topic.content}</p>
          <small>{topic.datePublished}</small>
        </div>
      ))}
    </div>
  );
};

export default async function Home() {
  const topics = await serverClient.topic.getMyTopics();

  return (
    <div>
      <TopicForm />

      {topics && topics.length > 0 && <TopicList topics={topics} />}
    </div>
  );
}
