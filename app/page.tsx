import { getProperties } from '@/lib/db';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">🏠</div>
            <h1 className="text-2xl font-bold">PropertyBook</h1>
          </div>
          <Link href="/admin/login">
            <Button variant="ghost">Admin</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-4xl px-4 py-16 md:py-24">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground">
            Discover Your Perfect
            <span className="block text-primary">Getaway</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse through our collection of beautiful properties and book your next stay with confidence. Easy, secure, and hassle-free.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Available Properties</h2>
            <span className="text-sm text-muted-foreground">{properties.length} properties</span>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No properties available yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for amazing properties!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16 py-8">
        <div className="container max-w-4xl px-4">
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">About</h3>
              <p className="text-sm text-muted-foreground">Your trusted platform for property bookings.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PropertyBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
