import Image from 'next/image';
import { QuestForm } from '@/components/quest/questForm';
import Link from 'next/link';
type Post = {
  id: string;
  title: string;
  content: string;
  datePublished: string;
  image: string;
};
type Quest = {
  id: string;
  title: string;
  content: string;
  datePublished: string;
  image: string;
  userId: string;
  posts: Post[];
};
export const QuestList = ({ quests }: { quests: Quest[] }) => {
  return (
    <div className="border inline-block">
      <QuestForm />
      {quests.map(quest => (
        <Link key={quest.id} href={`${quest.userId}`} className="quest w-80">
          <Image
            src={quest.image}
            alt={`image for ${quest.title}`}
            width={400}
            height={300}
          />
          <h2>{quest.title}</h2>
          <p>{quest.content}</p>
          <small>{quest.datePublished}</small>
          {/* <div className="m-5">
            {quest.posts.length > 0 ? (
              quest.posts.map(post => (
                <div key={post.id} className="post">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <small>{post.datePublished}</small>
                  <Image
                    src={post.image}
                    alt={`image for ${post.title}`}
                    width={200}
                    height={200}
                  />
                </div>
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </div> */}
        </Link>
      ))}
    </div>
  );
};
