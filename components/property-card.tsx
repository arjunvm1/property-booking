'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  max_guests: number;
}

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary/40 mb-2">🏠</div>
          <p className="text-muted-foreground text-sm">Property Image</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{property.name}</CardTitle>
        <CardDescription className="line-clamp-2">{property.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-muted-foreground">Per night</p>
            <p className="text-2xl font-bold text-primary">₹{property.price_per_night}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Max guests</p>
            <p className="text-lg font-semibold">{property.max_guests}</p>
          </div>
        </div>
        <Link href={`/properties/${property.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
