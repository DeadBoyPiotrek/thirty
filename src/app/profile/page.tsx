'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>User Profile</h1>
      {!session ? (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      ) : (
        <>
          Signed in as {session?.user?.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
