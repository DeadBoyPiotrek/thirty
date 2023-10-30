'use client';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export const Switch = () => {
  return (
    <form>
      <div className="flex items-center ">
        <label
          className="text-white text-[15px] leading-none pr-[15px]"
          htmlFor="profile-private"
        >
          Profile Private
        </label>
        <SwitchPrimitive.Root
          className="transition duration-200 w-[42px] h-[25px] bg-brandGray/30 rounded-full relative outline-none data-[state=checked]:bg-brandPurple focus:outline-brandGray "
          id="profile-private"
        >
          <SwitchPrimitive.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </SwitchPrimitive.Root>
      </div>
    </form>
  );
};
