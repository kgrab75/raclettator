import prisma from '@/lib/prisma';

export async function fetchParticipantsByToken(adminToken: string) {
  try {
    return await prisma.participant.findMany({
      where: { event: { adminToken } },
      select: {
        id: true,
        name: true,
        eaterSize: true,
        noPork: true,
        noAlcohol: true,
        isVeggie: true,
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch participants.');
  }
}

export async function fetchPublicParticipants(publicToken: string) {
  try {
    return await prisma.participant.findMany({
      where: { event: { publicToken } },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch public participants.');
  }
}
