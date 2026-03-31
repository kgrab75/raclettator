import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function fetchItemsByToken(adminToken: string) {
  const event = await prisma.event.findUnique({
    where: { adminToken },
    include: {
      items: {
        orderBy: [{ updatedAt: 'desc' }, { name: 'asc' }],
      },
    },
  });

  if (!event) {
    notFound();
  }

  return event.items;
}

export async function fetchPublicItems(publicToken: string) {
  const event = await prisma.event.findUnique({
    where: { publicToken },
    include: {
      items: {
        include: {
          contributions: {
            include: {
              participant: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
      },
    },
  });

  if (!event) {
    notFound();
  }

  return event.items;
}
