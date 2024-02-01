import { authOptions } from '@/lib/authOptions';

import { getServerSession } from 'next-auth';

export const serverSession = async () => await getServerSession(authOptions);
