import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(
  guestEmail: string,
  guestName: string,
  propertyName: string,
  checkIn: Date,
  checkOut: Date,
  numberOfGuests: number,
  totalPrice: number,
  bookingId: string
) {
  const checkInDate = new Date(checkIn).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const numberOfNights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  try {
    const response = await resend.emails.send({
      from: 'bookings@propertymanagement.com',
      to: guestEmail,
      subject: `Booking Confirmation - ${propertyName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
              .content { border: 1px solid #ddd; border-top: none; padding: 20px; }
              .booking-details { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-row:last-child { border-bottom: none; }
              .label { font-weight: bold; }
              .total { font-size: 18px; color: #2563eb; font-weight: bold; }
              .footer { background-color: #f3f4f6; padding: 15px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; color: #6b7280; }
              .button { background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Booking Confirmation!</h1>
              </div>
              <div class="content">
                <p>Dear ${guestName},</p>
                <p>Thank you for booking with us! Your booking has been confirmed. Here are your booking details:</p>
                
                <div class="booking-details">
                  <div class="detail-row">
                    <span class="label">Booking ID:</span>
                    <span>${bookingId}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Property:</span>
                    <span>${propertyName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Check-in:</span>
                    <span>${checkInDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Check-out:</span>
                    <span>${checkOutDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Number of Nights:</span>
                    <span>${numberOfNights}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Number of Guests:</span>
                    <span>${numberOfGuests}</span>
                  </div>
                  <div class="detail-row" style="font-size: 16px; padding-top: 15px; padding-bottom: 0;">
                    <span class="label">Total Price:</span>
                    <span class="total">₹${totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <p>We look forward to welcoming you! If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br>Property Management Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 Property Management. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return response;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

export async function sendCancellationEmail(
  guestEmail: string,
  guestName: string,
  propertyName: string,
  bookingId: string
) {
  try {
    const response = await resend.emails.send({
      from: 'bookings@propertymanagement.com',
      to: guestEmail,
      subject: `Booking Cancelled - ${propertyName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
              .content { border: 1px solid #ddd; border-top: none; padding: 20px; }
              .footer { background-color: #f3f4f6; padding: 15px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Booking Cancelled</h1>
              </div>
              <div class="content">
                <p>Dear ${guestName},</p>
                <p>Your booking (ID: ${bookingId}) for ${propertyName} has been cancelled.</p>
                <p>If you did not request this cancellation or have any questions, please contact us immediately.</p>
                <p>Best regards,<br>Property Management Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 Property Management. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return response;
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    throw error;
  }
}
