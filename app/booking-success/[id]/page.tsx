import { getBookingById, getPropertyById } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BookingSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) {
    notFound();
  }

  const property = await getPropertyById(booking.property_id);
  const checkInDate = new Date(booking.check_in).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const checkOutDate = new Date(booking.check_out).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const numberOfNights = Math.ceil(
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
          <CardDescription className="text-base">
            Thank you for your booking. A confirmation email has been sent to your email address.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Booking Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Booking Details</h3>
              <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono font-semibold">{booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-semibold">{property?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guest Name</span>
                  <span className="font-semibold">{booking.guest_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guest Email</span>
                  <span className="font-semibold">{booking.guest_email}</span>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div>
              <h3 className="font-semibold mb-3">Stay Details</h3>
              <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-semibold">{checkInDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-semibold">{checkOutDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Nights</span>
                  <span className="font-semibold">{numberOfNights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Guests</span>
                  <span className="font-semibold">{booking.number_of_guests}</span>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div>
              <h3 className="font-semibold mb-3">Price Details</h3>
              <div className="space-y-2 text-sm bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-bold text-lg text-primary">₹{booking.total_price.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Payment has been successfully processed.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="font-semibold mb-3">Next Steps</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Check your email for the booking confirmation</li>
                <li>Save your booking ID for reference</li>
                <li>Arrive 15 minutes before check-in time</li>
                <li>If you have any questions, contact our support team</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
            <Link href={`/properties/${booking.property_id}`} className="flex-1">
              <Button className="w-full">
                View Property
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
