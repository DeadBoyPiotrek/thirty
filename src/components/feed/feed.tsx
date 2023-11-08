import { serverClient } from '@/app/_trpc/serverClient';
import { Post } from '../post/post';

export const Feed = async () => {
  const posts = await serverClient.post.getFeedPosts();

  return (
    <div className="flex flex-col">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
