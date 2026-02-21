import { NextRequest, NextResponse } from 'next/server';
import { getProperties, createProperty } from '@/lib/db';

export async function GET() {
  try {
    const properties = await getProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, pricePerNight, maxGuests } = await request.json();

    if (!name || !description || !pricePerNight || !maxGuests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const property = await createProperty(name, description, pricePerNight, maxGuests);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
