import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Missing required parameters: propertyId, checkIn, checkOut' },
        { status: 400 }
      );
    }

    const availability = await checkAvailability(
      propertyId,
      new Date(checkIn),
      new Date(checkOut)
    );

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
