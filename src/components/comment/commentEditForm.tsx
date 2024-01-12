import { trpc } from '@/app/_trpc/client';
import { commentSchema } from '@/lib/schemas/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';

interface CommentEditFormProps {
  id: number;
  content: string;
  closeModal: () => void;
}

type Inputs = Zod.infer<typeof commentSchema>;

export const CommentEditForm = ({
  closeModal,
  content,
  id,
}: CommentEditFormProps) => {
  const { mutate: updateComment, isLoading } =
    trpc.post.updateComment.useMutation({
      onSettled: () => {
        closeModal();
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: content },
  });

  const onSubmit = async (data: Inputs) => {
    updateComment({ id, content: data.content });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
    flex flex-col gap-2 p-5 w-96
    "
    >
      <Textarea {...register('content')} />
      {errors.content && <span>{errors.content.message}</span>}
      <span className="flex gap-2 justify-center">
        <Button isLoading={isLoading} type="submit" variant={'brand'}>
          Save
        </Button>
        <Button
          isLoading={isLoading}
          type="reset"
          variant={'dark'}
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
      </span>
    </form>
  );
};
