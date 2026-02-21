'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

// Placeholder data - in a real app, this would come from the database
const bookings = [
  {
    id: '1',
    guestName: 'John Doe',
    property: 'Beachside Villa',
    checkIn: '2024-02-25',
    checkOut: '2024-03-01',
    status: 'confirmed',
    totalPrice: 900,
  },
  {
    id: '2',
    guestName: 'Jane Smith',
    property: 'Mountain Cabin',
    checkIn: '2024-03-05',
    checkOut: '2024-03-10',
    status: 'pending',
    totalPrice: 500,
  },
  {
    id: '3',
    guestName: 'Bob Johnson',
    property: 'City Apartment',
    checkIn: '2024-02-20',
    checkOut: '2024-02-25',
    status: 'confirmed',
    totalPrice: 600,
  },
];

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Bookings</h2>
        <p className="text-muted-foreground mt-1">Manage all property bookings</p>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle>{booking.guestName}</CardTitle>
                <CardDescription>{booking.property}</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                  {booking.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Check-in</p>
                  <p className="text-sm font-semibold">{booking.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Check-out</p>
                  <p className="text-sm font-semibold">{booking.checkOut}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Price</p>
                  <p className="text-sm font-semibold">${booking.totalPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
