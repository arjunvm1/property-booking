'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CalendarPage() {
  const [selectedProperty, setSelectedProperty] = useState('1');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Calendar</h2>
        <p className="text-muted-foreground mt-1">View and manage property availability</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Calendar</CardTitle>
          <CardDescription>Select a property to view its calendar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Beachside Villa</SelectItem>
              <SelectItem value="2">Mountain Cabin</SelectItem>
              <SelectItem value="3">City Apartment</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-8 p-4 bg-muted rounded-lg text-center text-muted-foreground">
            Calendar view coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
