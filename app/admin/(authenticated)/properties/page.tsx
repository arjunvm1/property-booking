'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Plus } from 'lucide-react';

// Placeholder data - in a real app, this would come from the database
const properties = [
  { id: '1', name: 'Beachside Villa', description: 'Beautiful villa with ocean view', pricePerNight: 150, maxGuests: 8 },
  { id: '2', name: 'Mountain Cabin', description: 'Cozy cabin in the mountains', pricePerNight: 100, maxGuests: 4 },
  { id: '3', name: 'City Apartment', description: 'Modern apartment in downtown', pricePerNight: 120, maxGuests: 2 },
];

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Properties</h2>
          <p className="text-muted-foreground mt-1">Manage your rental properties</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <div className="grid gap-4">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{property.name}</CardTitle>
                <CardDescription>{property.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Property</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this property? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price per Night</p>
                  <p className="text-lg font-bold">${property.pricePerNight}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Max Guests</p>
                  <p className="text-lg font-bold">{property.maxGuests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
