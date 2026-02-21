'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Lock, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: any[];
  isBlocked: boolean;
  isPast: boolean;
}

interface CalendarProps {
  propertyId: string;
  bookings: any[];
  blockedDates: any[];
  onBlockDate?: (date: Date) => void;
  onUnblockDate?: (dateId: string) => void;
}

export function Calendar({
  propertyId,
  bookings,
  blockedDates,
  onBlockDate,
  onUnblockDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days: CalendarDay[] = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    // Previous month's days
    const prevMonthDays = daysInMonth(new Date(year, month - 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        dayOfMonth: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
        bookings: [],
        isBlocked: false,
        isPast: true,
      });
    }

    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const dayBookings = bookings.filter((b) => {
        const checkIn = new Date(b.check_in);
        const checkOut = new Date(b.check_out);
        return b.status === 'confirmed' && date >= checkIn && date < checkOut;
      });

      const blockedDate = blockedDates.find(
        (bd) =>
          new Date(bd.date).toDateString() === date.toDateString()
      );

      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday,
        bookings: dayBookings,
        isBlocked: !!blockedDate,
        isPast: date < today,
      });
    }

    // Next month's days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        dayOfMonth: i,
        isCurrentMonth: false,
        isToday: false,
        bookings: [],
        isBlocked: false,
        isPast: true,
      });
    }

    return days;
  }, [currentDate, bookings, blockedDates]);

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{monthYear}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-muted">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-24 p-2 border-r border-b text-xs
                ${!day.isCurrentMonth ? 'bg-muted/30' : 'bg-white'}
                ${day.isToday ? 'bg-accent/10' : ''}
                ${day.isPast && day.isCurrentMonth ? 'bg-muted/20' : ''}
              `}
            >
              <div className="font-semibold mb-1 text-foreground">
                {day.dayOfMonth}
              </div>

              {/* Bookings */}
              {day.bookings.length > 0 && (
                <div className="space-y-1 mb-1">
                  {day.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-blue-100 text-blue-700 rounded px-1.5 py-0.5 text-xs truncate flex items-center gap-1"
                      title={booking.guest_name}
                    >
                      <BookMarked className="h-3 w-3 flex-shrink-0" />
                      {booking.guest_name}
                    </div>
                  ))}
                </div>
              )}

              {/* Blocked */}
              {day.isBlocked && (
                <div className="bg-red-100 text-red-700 rounded px-1.5 py-0.5 text-xs flex items-center gap-1">
                  <Lock className="h-3 w-3 flex-shrink-0" />
                  Blocked
                </div>
              )}

              {/* Status Indicators */}
              {day.isToday && (
                <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-accent rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Booking</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded flex items-center justify-center">
            <Lock className="h-3 w-3 text-red-700" />
          </div>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-accent/20 border border-accent rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
