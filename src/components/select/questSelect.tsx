import * as Select from '@radix-ui/react-select';
import { ControllerRenderProps } from 'react-hook-form';
import {
  MdKeyboardArrowDown,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';

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
      className="p-2 rounded-lg h-11 overflow-hidden lg:w-96 break-words flex items-center justify-between focus:outline-none text-brandWhite-pure bg-brandBlack-light focus:ring-1 focus:ring-brandPurple-500 hover:ring-1 ring-brandPurple-500"
      aria-label="goal"
      key={field.value}
    >
      <Select.Value className="bg-green-300" placeholder="Select goal..." />
      <Select.Icon className="text-2xl">
        <MdKeyboardArrowDown />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        position="popper"
        className=" bg-brandBlack-medium border border-brandGray rounded-lg max-w-sm  p-2 max-h-[var(--radix-select-content-available-height)]"
      >
        <Select.ScrollUpButton className="flex justify-center text-2xl">
          <MdOutlineKeyboardArrowUp />
        </Select.ScrollUpButton>
        <Select.Viewport>
          <Select.Group>
            {quests.map(quest => {
              return (
                <Select.Item
                  key={quest.id}
                  value={quest.id.toString()}
                  className="max-w-sm overflow-hidden break-words cursor-pointer p-2 rounded-md data-[highlighted]:outline-none data-[highlighted]:bg-brandBlack-light hover:bg-brandBlack-light hover:outline-none "
                >
                  <Select.ItemText>{quest.title}</Select.ItemText>
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="flex justify-center text-2xl">
          <MdOutlineKeyboardArrowDown />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);
