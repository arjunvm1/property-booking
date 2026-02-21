import { NextRequest, NextResponse } from 'next/server';
import { getBlockedDates, addBlockedDate, removeBlockedDate } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'propertyId is required' },
        { status: 400 }
      );
    }

    const blockedDates = await getBlockedDates(propertyId);
    return NextResponse.json(blockedDates);
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return NextResponse.json({ error: 'Failed to fetch blocked dates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { propertyId, date, reason } = await request.json();

    if (!propertyId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyId, date' },
        { status: 400 }
      );
    }

    const blockedDate = await addBlockedDate(propertyId, new Date(date), reason);
    return NextResponse.json(blockedDate, { status: 201 });
  } catch (error) {
    console.error('Error adding blocked date:', error);
    return NextResponse.json({ error: 'Failed to add blocked date' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      );
    }

    await removeBlockedDate(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing blocked date:', error);
    return NextResponse.json({ error: 'Failed to remove blocked date' }, { status: 500 });
  }
}
