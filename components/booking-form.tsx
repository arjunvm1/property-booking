'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BookingFormProps {
  propertyId: string;
  propertyName: string;
  pricePerNight: number;
  maxGuests: number;
}

export function BookingForm({
  propertyId,
  propertyName,
  pricePerNight,
  maxGuests,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    numberOfGuests: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculatePrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, nights * pricePerNight);
  };

  const totalPrice = calculatePrice();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.guestName || !formData.guestEmail || !formData.guestPhone ||
          !formData.checkIn || !formData.checkOut || !formData.numberOfGuests) {
        throw new Error('Please fill all fields');
      }

      if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
        throw new Error('Check-out date must be after check-in date');
      }

      if (formData.numberOfGuests > maxGuests) {
        throw new Error(`Maximum guests allowed: ${maxGuests}`);
      }

      // Create order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          numberOfGuests: formData.numberOfGuests,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const data = await response.json();
      const { booking, order } = data;

      // Load Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: propertyName,
        description: `Booking for ${propertyName}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId: booking.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                orderId: order.id,
              }),
            });

            if (!verifyResponse.ok) {
              const data = await verifyResponse.json();
              throw new Error(data.error || 'Payment verification failed');
            }

            setSuccess(`Booking confirmed! Confirmation email sent to ${formData.guestEmail}`);
            setFormData({
              guestName: '',
              guestEmail: '',
              guestPhone: '',
              checkIn: '',
              checkOut: '',
              numberOfGuests: 1,
            });

            setTimeout(() => {
              window.location.href = '/booking-success/' + booking.id;
            }, 2000);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment verification failed');
          }
        },
        prefill: {
          name: formData.guestName,
          email: formData.guestEmail,
          contact: formData.guestPhone,
        },
        theme: {
          color: 'oklch(0.55 0.15 345)',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
        <CardDescription>Complete the form below to proceed with booking</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.guestEmail}
              onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.guestPhone}
              onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in</Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out</Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests (Max: {maxGuests})</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={maxGuests}
              value={formData.numberOfGuests}
              onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2 border">
            {formData.checkIn && formData.checkOut && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))} night(s)
                  </span>
                  <span>₹{pricePerNight} × per night</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice}</span>
                </div>
              </>
            )}
            {!formData.checkIn || !formData.checkOut ? (
              <p className="text-sm text-muted-foreground">Select dates to calculate price</p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={loading || !totalPrice}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${totalPrice}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
