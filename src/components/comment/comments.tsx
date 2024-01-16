'use client';
import { commentSchema } from '@/lib/schemas/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Textarea } from '@ui/textarea';
import { Button } from '../ui/button';
import { trpc } from '@/app/_trpc/client';
import { Comment } from './comment';

interface CommentsProps {
  comments: Comment[];
  postId: number;
  amount: number;
}
interface Comment {
  id: number;
  content: string;
  datePublished: Date;
  user: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
}

export const Comments = ({ postId, comments, amount }: CommentsProps) => {
  type Inputs = Zod.infer<typeof commentSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({ resolver: zodResolver(commentSchema) });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    addComment({
      content: data.content,
      postId,
    });
    console.log(data);
    reset();
  };

  const { mutate: addComment } = trpc.post.addComment.useMutation({
    onSettled: () => {},
  });

  const { data, isFetching, fetchNextPage } =
    trpc.post.loadMoreComments.useInfiniteQuery(
      { postId, limit: 10 },
      {
        getNextPageParam: lastPage => lastPage.cursor,
        initialData: {
          pageParams: [undefined],
          pages: [{ comments, cursor: comments[comments.length - 1]?.id }],
        },
        refetchOnMount: false,
      }
    );

  const commentsFetched = data?.pages.flatMap(page => page.comments).length;

  return (
    <div className="flex flex-col gap-2">
      {amount > 2 && amount !== commentsFetched ? (
        <span className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              fetchNextPage();
            }}
            isLoading={isFetching}
          >
            View more comments
          </Button>
          <p className="text-brandGray">
            {commentsFetched} of {amount}{' '}
          </p>
        </span>
      ) : null}
      {amount >= 1 && amount == commentsFetched ? (
        <p className="text-brandGray self-end">
          {commentsFetched} of {amount}{' '}
        </p>
      ) : null}

      <div className="pr-1 flex flex-col gap-2  max-h-96 overflow-y-scroll overscroll-none">
        {data?.pages
          .flatMap(page => page.comments)
          .map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex">
        <Textarea
          variant={'dark'}
          {...register('content')}
          placeholder="Add a comment..."
          className="w-full "
        />

        <Button variant={'dark'} disabled={Object.keys(errors).length > 0}>
          Comment
        </Button>
      </form>
    </div>
  );
};
