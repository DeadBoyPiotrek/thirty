import { LogInPrompt } from '@/components/ui/logInPrompt';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { PostForm } from '@/components/post/postForm';
import { Feed } from '@/components/feed/feed';
import { serverClient } from './_trpc/serverClient';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    const { posts } = await serverClient.post.getFeedPosts({ limit: 5 });
    const userQuests = await serverClient.quest.getQuestsForPostForm();
    return (
      <div className="flex flex-col items-center max-w-4xl">
        {userQuests ? <PostForm userQuests={userQuests} /> : null}
        <Feed initialPosts={{ posts, cursor: 1 }} />
      </div>
    );
  } else {
    return <LogInPrompt />;
  }
}
