'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

const ProfilePage = ({ params }: { params: { userId: string } }) => {
  console.log(`🚀 ~ ProfilePage ~ params:`, params);
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
};

export default ProfilePage;
