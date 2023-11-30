import * as Select from '@radix-ui/react-select';
import { ControllerRenderProps } from 'react-hook-form';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface QuestSelectProps {
  field: ControllerRenderProps<
    {
      title: string;
      image: FileList;
      content: string;
      questId: number;
    },
    'questId'
  >;
  quests: {
    id: number;
    title: string;
  }[];
}

export const QuestSelect = ({ field, quests }: QuestSelectProps) => (
  <Select.Root onValueChange={value => field.onChange(parseInt(value))}>
    <Select.Trigger
      className="text-brandWhite-pure bg-brandBlack-medium border border-brandGray p-2 rounded-lg h-11 overflow-hidden w-96 break-words flex items-center justify-between"
      aria-label="quests"
      key={field.value}
    >
      <Select.Value className="bg-green-300" placeholder="Select quest..." />
      <Select.Icon className="text-2xl">
        <MdKeyboardArrowDown />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        position="popper"
        className=" bg-brandBlack-medium border border-brandGray rounded-lg max-w-sm max-h-24"
      >
        <Select.Group>
          {quests.map(quest => {
            return (
              <Select.Item
                key={quest.id}
                value={quest.id.toString()}
                className="max-w-sm overflow-hidden break-words hover:bg-brandBlack-light cursor-pointer p-2 "
              >
                <Select.ItemText>{quest.title}</Select.ItemText>
              </Select.Item>
            );
          })}
        </Select.Group>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);
