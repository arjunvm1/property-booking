import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = crypto.randomBytes(16).toString('hex');

  // Store session data (in production, this should be stored in a database)
  cookieStore.set('admin_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/admin',
  });

  return sessionId;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('admin_session')?.value;
  return sessionId;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return !!session;
}
