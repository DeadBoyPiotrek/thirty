import { PostForm } from '@/components/post/postForm';
import { TopicForm } from '@/components/topic/topicForm';

export default async function Home() {
  return (
    <div>
      <TopicForm />
      <PostForm />
    </div>
  );
}
