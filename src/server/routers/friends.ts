import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';

export const friendsRouter = router({
  sendFriendRequest: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;
      const user = await prisma.user.findUnique({
        where: {
          profileId: input.profileId,
        },
        select: {
          id: true,
          friends: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const friendRequest = await prisma.friendRequest.create({
        data: {
          senderId: userId,
          receiverId: user.id,
        },
      });

      return friendRequest;
    }),

  getFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        AND: {
          status: 'pending',
        },
      },
      select: {
        sender: {
          select: {
            profileId: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return friendRequests;
  }),

  acceptFriendRequest: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log('first user id', ctx.userId);
      console.log('second user profileId', input.profileId);
      await prisma.user.update({
        where: {
          id: ctx.userId,
        },
        data: {
          friends: {
            connect: {
              profileId: input.profileId,
            },
          },
        },
      });
    }),

  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const friends = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: {
          select: {
            name: true,
            profileId: true,
            image: true,
          },
        },
      },
    });

    return friends?.friends ?? [];
  }),
});
