import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { getPaymentByBookingId, updatePaymentStatus, updateBookingStatus, getBookingById, getPropertyById } from '@/lib/db';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, paymentId, signature, orderId } = await request.json();

    if (!bookingId || !paymentId || !signature || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, paymentId, signature, orderId' },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      console.warn(`Invalid payment signature for booking: ${bookingId}`);
      // Update payment status to failed
      const payment = await getPaymentByBookingId(bookingId);
      if (payment) {
        await updatePaymentStatus(payment.id, 'failed');
      }
      await updateBookingStatus(bookingId, 'cancelled');

      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Get payment record
    const payment = await getPaymentByBookingId(bookingId);
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Update payment status to completed
    await updatePaymentStatus(payment.id, 'completed', paymentId, signature);

    // Update booking status to confirmed
    const updatedBooking = await updateBookingStatus(bookingId, 'confirmed');

    // Send confirmation email
    try {
      const property = await getPropertyById(updatedBooking.property_id);
      if (property) {
        await sendBookingConfirmation(
          updatedBooking.guest_email,
          updatedBooking.guest_name,
          property.name,
          updatedBooking.check_in,
          updatedBooking.check_out,
          updatedBooking.number_of_guests,
          updatedBooking.total_price,
          bookingId
        );
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      bookingId,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
