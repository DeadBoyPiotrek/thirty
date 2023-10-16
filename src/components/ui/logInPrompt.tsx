'use client';

import { signIn } from 'next-auth/react';

export const LogInPrompt = () => {
  return (
    <div>
      <h1>Your Gateway to Awesomeness</h1>
      <button
        className='class="transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300'
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </div>
  );
};
