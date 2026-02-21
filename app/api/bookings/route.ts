import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking, checkAvailability } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const bookings = await getBookings(propertyId || undefined);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      propertyId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      numberOfGuests,
      totalPrice,
    } = await request.json();

    if (!propertyId || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut || !numberOfGuests || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check availability
    const availability = await checkAvailability(propertyId, new Date(checkIn), new Date(checkOut));
    if (!availability.available) {
      return NextResponse.json(
        { error: 'Property is not available for the selected dates' },
        { status: 409 }
      );
    }

    const booking = await createBooking(
      propertyId,
      guestName,
      guestEmail,
      guestPhone,
      new Date(checkIn),
      new Date(checkOut),
      numberOfGuests,
      totalPrice
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
