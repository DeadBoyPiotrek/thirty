'use client';

import { signIn } from 'next-auth/react';

export const LogInPrompt = () => {
  return (
    <div className="flex items-center h-screen">
      <div className="flex flex-col gap-5 p-10 max-w-5xl">
        <h1 className="text-5xl font-bold leading-normal">
          Connect, share and achieve with{' '}
          <span className="text-brandPurple-500 font-extrabold">
            Target Tracker
          </span>
        </h1>
        <h2 className="text-2xl leading-relaxed">
          Elevate your goals with community support. Add friends, share your
          journey, and turn your aspirations into reality, one post at a time.
        </h2>
        <button
          className="transition ease-in-out delay-50 bg-brandPurple-500 hover:scale-110 hover:bg-brandPurple-700 duration-300 text-xl p-3 rounded-lg self-center font-semibold mt-3"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
