import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function checkRateLimit(maxRequestsPerMinute = 10): Promise<boolean> {
  try {
    const list = await headers();
    const rawIp = list.get('x-forwarded-for') || list.get('x-real-ip') || '127.0.0.1';
    const ip = rawIp.split(',')[0].trim();
    
    const now = new Date();
    const record = await prisma.rateLimit.findUnique({ where: { ip } });
    
    if (!record || record.expiresAt < now) {
      const expiresAt = new Date(now.getTime() + 60000); // 1 minute window
      await prisma.rateLimit.upsert({
        where: { ip },
        update: { points: 1, expiresAt },
        create: { ip, points: 1, expiresAt },
      });
      return true;
    }
    
    if (record.points >= maxRequestsPerMinute) {
      return false; // Rate limit exceeded
    }
    
    await prisma.rateLimit.update({
      where: { ip },
      data: { points: { increment: 1 } },
    });
    
    return true;
  } catch (error) {
    console.warn('Rate limit error:', error);
    return true; // Fail open
  }
}
