'use client';
import { commentSchema } from '@/lib/schemas/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Textarea } from '@ui/textarea';
import { Button } from '../ui/button';
import { trpc } from '@/app/_trpc/client';
import { Comment } from './comment';

interface CommentsProps {
  initialComments: Comment[];
  postId: number;
  initialAmount: number;
  formOpen?: boolean;
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

export const Comments = ({
  postId,
  initialComments,
  initialAmount,
  formOpen,
}: CommentsProps) => {
  type Inputs = Zod.infer<typeof commentSchema>;
  const utils = trpc.useUtils();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({ resolver: zodResolver(commentSchema) });

  const { mutate: addComment, isLoading } = trpc.post.addComment.useMutation({
    onSettled: () => {
      utils.post.getFeedPosts.invalidate();
    },
  });

  const { data, isFetching, fetchNextPage, hasNextPage, refetch } =
    trpc.post.loadMoreComments.useInfiniteQuery(
      { postId, limit: 10 },
      {
        getNextPageParam: lastPage => lastPage.cursor ?? undefined,

        initialData: {
          pageParams: [undefined],
          pages: [
            {
              comments: initialComments,
              commentsAmount: initialAmount,
              cursor: initialComments[initialComments.length - 1]?.id,
            },
          ],
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );
  const onSubmit: SubmitHandler<Inputs> = async data => {
    addComment(
      {
        content: data.content,
        postId,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
    reset();
  };

  const commentsFetchedAmount = data?.pages.flatMap(
    page => page.comments
  ).length;
  const allCommentsAmount =
    data?.pages.flatMap(page => page.commentsAmount)[0] || initialAmount;
  return (
    <div className="flex flex-col gap-2">
      {(allCommentsAmount > 2 && allCommentsAmount !== commentsFetchedAmount) ||
      !hasNextPage ? (
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
            {commentsFetchedAmount} of {allCommentsAmount}{' '}
          </p>
        </span>
      ) : null}
      {allCommentsAmount >= 1 && allCommentsAmount == commentsFetchedAmount ? (
        <p className="text-brandGray self-end">
          {commentsFetchedAmount} of {allCommentsAmount}
        </p>
      ) : null}

      <div className="pr-1 flex flex-col gap-2  max-h-96 overflow-y-scroll overscroll-none">
        {data?.pages
          .flatMap(page => page.comments)
          .map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
      </div>
      {formOpen ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex">
          <Textarea
            variant={'dark'}
            {...register('content')}
            placeholder="Add a comment..."
            className="w-full "
          />

          <Button
            variant={'dark'}
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            Comment
          </Button>
        </form>
      ) : null}
    </div>
  );
};
