import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, setAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const sessionId = await setAdminSession();

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
