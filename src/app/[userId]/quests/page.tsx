import { serverClient } from '@_trpc/serverClient';
import { QuestForm } from '@/components/quest/questForm';
import { QuestList } from '@/components/quest/questsList';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
const QuestsPage = async ({ params }: { params: { userId: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }
  const loggedUserId = session.user?.id;
  const user = await serverClient.user.userExists({
    userId: parseInt(params.userId),
  });
  if (!user) {
    return notFound();
  }
  const quests = await serverClient.quest.getQuests({
    userId: parseInt(params.userId),
  });

  return (
    <div className="flex flex-col max-w-4xl w-full">
      <Link href={'/asdf'} className="border w-10 h-10 ">
        <p className="text-2xl bg-red-50/10 text-brandPurple-500 break-words pt-2 pl-2 h-full overflow-hidden text-ellipsis ">
          sasd lkfjh asdfk ljhsdfg sdfg
        </p>
      </Link>
      <h1 className="text-4xl font-bold">
        Quests of <span className="text-brandPurple-500">{user.name}</span>
      </h1>
      {loggedUserId === parseInt(params.userId) ? <QuestForm /> : null}
      <QuestList quests={quests} />
    </div>
  );
};

export default QuestsPage;
