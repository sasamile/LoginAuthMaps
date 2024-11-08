import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Booking {
  id: string;
  user: {
    name: string;
    email: string;
  };
  court: {
    name: string;
  };
  date: string;
  totalPrice: number;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="space-y-8">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{booking.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{booking.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {booking.court.name} - {new Date(booking.date).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto font-medium">${booking.totalPrice.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}