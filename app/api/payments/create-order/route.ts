import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay';
import { createPayment, createBooking, checkAvailability } from '@/lib/db';

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

    // Create booking with pending status
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

    // Create Razorpay order
    const razorpayOrder = await createOrder(
      Math.round(totalPrice * 100), // Convert to paise
      'INR',
      booking.id,
      {
        bookingId: booking.id,
        propertyId,
        guestName,
        guestEmail,
      }
    );

    // Store payment record
    const payment = await createPayment(booking.id, razorpayOrder.id, totalPrice);

    return NextResponse.json(
      {
        booking,
        order: razorpayOrder,
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
