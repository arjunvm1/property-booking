import { getPropertyById, getBookings, getBlockedDates } from '@/lib/db';
import { BookingForm } from '@/components/booking-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const bookings = await getBookings(id);
  const blockedDates = await getBlockedDates(id);

  const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl font-bold text-primary/30 mb-4">🏠</div>
                <p className="text-muted-foreground">Property Image</p>
              </div>
            </div>

            {/* Property Info */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{property.name}</h1>
              <p className="text-lg text-muted-foreground">{property.description}</p>

              <div className="grid grid-cols-2 gap-6 py-6 border-y">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price per Night</p>
                  <p className="text-3xl font-bold text-primary">₹{property.price_per_night}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maximum Guests</p>
                  <p className="text-3xl font-bold">{property.max_guests}</p>
                </div>
              </div>
            </div>

            {/* Availability Info */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold">Availability Information</h2>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <strong>Confirmed Bookings:</strong> {confirmedBookings.length}
                </p>
                <p className="text-muted-foreground">
                  <strong>Blocked Dates:</strong> {blockedDates.length}
                </p>
                <p className="text-muted-foreground">
                  Please select your dates carefully. All bookings require payment confirmation through our secure gateway.
                </p>
              </div>
            </div>

            {/* Booking Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">How to Book</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Fill in your details and select your check-in and check-out dates</li>
                <li>Review the total price and number of guests</li>
                <li>Click "Pay" to proceed to our secure payment gateway</li>
                <li>Complete the payment with Razorpay</li>
                <li>Receive instant confirmation via email</li>
              </ol>
            </div>
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm
                propertyId={id}
                propertyName={property.name}
                pricePerNight={property.price_per_night}
                maxGuests={property.max_guests}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
