import prisma from '@/lib/prisma';

export async function fetchEventByToken(adminToken: string) {
  try {
    return await prisma.event.findFirstOrThrow({
      where: { adminToken },
      include: {
        participants: {
          orderBy: { name: 'asc' },
        },
        items: {
          include: {
            contributions: {
              include: {
                participant: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            participants: true,
            items: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch event.');
  }
}

export async function fetchEventByPublicToken(publicToken: string) {
  try {
    return await prisma.event.findUniqueOrThrow({
      where: { publicToken },
      select: { 
        id: true,
        title: true, 
        location: true, 
        startsAt: true, 
        _count: {
          select: { participants: true, items: true }
        }
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch public event.');
  }
}
