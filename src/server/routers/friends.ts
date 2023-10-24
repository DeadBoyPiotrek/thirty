import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';

export const friendsRouter = router({
  sendFriendRequest: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;

      const friendRequest = await prisma.friendRequest.create({
        data: {
          senderId: userId,
          receiverId: input.profileId,
        },
      });

      return friendRequest;
    }),
  getReceivedFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const receivedFriendRequests = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        receivedFriendRequests: {
          select: {
            sender: {
              select: {
                name: true,
                id: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return receivedFriendRequests?.receivedFriendRequests ?? [];
  }),

  removeFriend: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          friends: {
            where: {
              id: input.profileId,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            disconnect: {
              id: input.profileId,
            },
          },
        },
      });

      await prisma.user.update({
        where: {
          id: input.profileId,
        },
        data: {
          friends: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    }),

  acceptFriendRequest: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await prisma.user.update({
          where: {
            id: ctx.userId,
          },
          data: {
            friends: {
              connect: {
                id: input.profileId,
              },
            },
          },
        });
        await prisma.user.update({
          where: {
            id: input.profileId,
          },
          data: {
            friends: {
              connect: {
                id: ctx.userId,
              },
            },
          },
        });

        await prisma.friendRequest.delete({
          where: {
            senderId_receiverId: {
              senderId: input.profileId,
              receiverId: ctx.userId,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Friend request not found',
        });
      }
    }),

  declineFriendRequest: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: input.profileId,
            receiverId: ctx.userId,
          },
        },
      });
    }),

  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: {
          select: {
            name: true,
            id: true,
            image: true,
          },
        },
      },
    });

    return data?.friends ?? [];
  }),

  areFriends: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const data = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          friends: {
            where: {
              id: input.profileId,
            },
          },
        },
      });
      const areFriends = data?.friends?.length ?? 0 > 0;
      return areFriends;
    }),

  isFriendRequestSent: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;

      const data = await prisma.friendRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: userId,
            receiverId: input.profileId,
          },
        },
      });

      return data !== null;
    }),

  isFriendRequestReceived: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;

      const data = await prisma.friendRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: input.profileId,
            receiverId: userId,
          },
        },
      });

      return data !== null;
    }),

  removeSentFriendRequest: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;

      await prisma.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: userId,
            receiverId: input.profileId,
          },
        },
      });
    }),
});
