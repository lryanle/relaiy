import { PrismaClient, ThreadStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function markInactiveThreads() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  await prisma.chatThread.updateMany({
    where: {
      status: ThreadStatus.ACTIVE,
      messages: {
        some: {
          sender: 'USER',
          timestamp: {
            lt: fiveMinutesAgo
          }
        }
      }
    },
    data: {
      status: ThreadStatus.INACTIVE
    }
  });
} 