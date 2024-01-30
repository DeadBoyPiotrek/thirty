import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';

export const friendsRouter = router({
  sendFriendRequest: protectedProcedure
    .input(z.object({ profileId: z.number() }))
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
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return receivedFriendRequests?.receivedFriendRequests ?? [];
  }),

  getSentFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const sentFriendRequests = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        sentFriendRequests: {
          select: {
            receiver: {
              select: {
                name: true,
                id: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return sentFriendRequests?.sentFriendRequests ?? [];
  }),

  removeFriend: protectedProcedure
    .input(z.object({ profileId: z.number().int() }))
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
    .input(z.object({ profileId: z.number().int() }))
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
    .input(z.object({ profileId: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.friendRequest.deleteMany({
        where: {
          OR: [
            {
              senderId: input.profileId,
              receiverId: ctx.userId,
            },
            {
              senderId: ctx.userId,
              receiverId: input.profileId,
            },
          ],
        },
      });
    }),

  // getFriends: protectedProcedure
  //   .input(z.object({ userId: z.number() }))
  //   .query(async ({ input }) => {
  //     const data = await prisma.user.findUnique({
  //       where: {
  //         id: input.userId,
  //       },
  //       select: {
  //         friends: {
  //           select: {
  //             name: true,
  //             id: true,
  //             imageUrl: true,
  //           },
  //         },
  //       },
  //     });

  //     return data?.friends ?? [];
  //   }),

  areFriends: protectedProcedure
    .input(z.object({ profileId: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const areFriends = !!(
        (await prisma.user.findFirst({
          where: {
            id: ctx.userId,
            friends: {
              some: {
                id: input.profileId,
              },
            },
          },
        })) || ctx.userId === input.profileId
      );
      return areFriends;
    }),

  isFriendRequestSent: protectedProcedure
    .input(z.object({ profileId: z.number().int() }))
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
    .input(z.object({ profileId: z.number().int() }))
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
    .input(z.object({ profileId: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: ctx.userId,
            receiverId: input.profileId,
          },
        },
      });
    }),
});
