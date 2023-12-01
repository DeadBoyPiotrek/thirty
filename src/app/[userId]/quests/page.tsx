import { serverClient } from '@_trpc/serverClient';
import { QuestForm } from '@/components/quest/questForm';
import { QuestList } from '@/components/quest/questsList';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    <div className="flex flex-col justify-center items-center max-w-7xl ">
      {loggedUserId === parseInt(params.userId) ? <QuestForm /> : null}
      <h1 className="text-4xl font-bold m-5">
        Quests of <span className="text-brandPurple-500">{user.name}</span>
      </h1>
      <QuestList initQuests={quests} userId={parseInt(params.userId)} />
    </div>
  );
};

export default QuestsPage;
