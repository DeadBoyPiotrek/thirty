import { serverClient } from '@_trpc/serverClient';
import { QuestForm } from '@/components/quest/questForm';
import { QuestList } from '@/components/quest/questsList';
const QuestsPage = async () => {
  const quests = await serverClient.quest.getMyQuests();
  return (
    <div>
      <QuestForm />
      <div>{quests && quests.length > 0 && <QuestList quests={quests} />}</div>
    </div>
  );
};

export default QuestsPage;
