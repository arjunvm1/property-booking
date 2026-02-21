import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Calendar, Users, Package } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-primary text-primary-foreground border-r border-primary/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">🏠</div>
            <h1 className="text-xl font-bold">PropertyBook</h1>
          </div>
          <p className="text-xs text-primary-foreground/60 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          <NavLink href="/admin/dashboard" icon={<Home className="h-4 w-4" />} label="Dashboard" />
          <NavLink href="/admin/properties" icon={<Package className="h-4 w-4" />} label="Properties" />
          <NavLink href="/admin/calendar" icon={<Calendar className="h-4 w-4" />} label="Calendar" />
          <NavLink href="/admin/bookings" icon={<Users className="h-4 w-4" />} label="Bookings" />
        </nav>

        {/* Logout */}
        <div className="border-t border-primary/20 p-3">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="px-8 h-16 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <Link href="/">
              <Button variant="ghost" size="sm">
                View Site
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className="w-full justify-start text-primary-foreground hover:bg-primary/20 gap-3"
        size="sm"
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
}

function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server';
        try {
          await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/admin/logout', {
            method: 'POST',
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start text-primary-foreground hover:bg-primary/20 gap-3"
        size="sm"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}
