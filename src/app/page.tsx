import { LogInPrompt } from '@/components/ui/logInPrompt';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { PostForm } from '@/components/post/postForm';
import { Feed } from '@/components/feed/feed';
export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <div className="flex flex-col justify-center">
        <PostForm />
        <Feed />
      </div>
    );
  } else {
    return <LogInPrompt />;
  }
}
