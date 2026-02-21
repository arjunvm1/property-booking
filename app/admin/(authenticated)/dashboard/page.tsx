'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 6000 },
  { month: 'May', revenue: 7000 },
  { month: 'Jun', revenue: 8000 },
];

const bookingData = [
  { week: 'Week 1', bookings: 12 },
  { week: 'Week 2', bookings: 15 },
  { week: 'Week 3', bookings: 10 },
  { week: 'Week 4', bookings: 18 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value="248" change="+12%" />
        <StatCard title="Revenue" value="$45,231" change="+8%" />
        <StatCard title="Properties" value="12" change="0%" />
        <StatCard title="Guests" value="342" change="+4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings by Week</CardTitle>
            <CardDescription>Current month bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8b5cf6" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs font-medium text-muted-foreground">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-green-600 mt-1">{change}</p>
      </CardContent>
    </Card>
  );
}
