import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById, getBookings } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const property = await getPropertyById(propertyId);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const bookings = await getBookings(propertyId);
    const confirmedBookings = (bookings as any[]).filter(b => b.status === 'confirmed');

    // Generate iCal content
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PropertyBook//Property Bookings//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${property.name} - Bookings
X-WR-CALDESC:Booking calendar for ${property.name}
X-WR-TIMEZONE:UTC
DTSTAMP:${now}
`;

    for (const booking of confirmedBookings) {
      const checkIn = new Date(booking.check_in).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const checkOut = new Date(booking.check_out).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const created = booking.created_at ? new Date(booking.created_at).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : now;

      icalContent += `BEGIN:VEVENT
UID:${booking.id}@propertybook.local
DTSTAMP:${created}
DTSTART:${checkIn}
DTEND:${checkOut}
SUMMARY:${property.name} - ${booking.guest_name}
DESCRIPTION:Guest: ${booking.guest_name}\\nEmail: ${booking.guest_email}\\nPhone: ${booking.guest_phone}\\nGuests: ${booking.number_of_guests}\\nTotal: ₹${booking.total_price}
LOCATION:${property.name}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
    }

    icalContent += `END:VCALENDAR`;

    return new NextResponse(icalContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${property.name.replace(/\s+/g, '_')}_bookings.ics"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating iCal feed:', error);
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 });
  }
}
