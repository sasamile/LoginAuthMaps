import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentBookings() {
  return (
    <div className="space-y-8">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={booking.avatar} alt="Avatar" />
            <AvatarFallback>{booking.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{booking.name}</p>
            <p className="text-sm text-muted-foreground">
              {booking.court} - {booking.date}
            </p>
          </div>
          <div className="ml-auto font-medium">+${booking.amount}</div>
        </div>
      ))}
    </div>
  )
}

const recentBookings = [
  {
    id: "1",
    name: "Juan Pérez",
    court: "Cancha 1",
    date: "2023-05-15",
    amount: "50",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "María García",
    court: "Cancha 2",
    date: "2023-05-16",
    amount: "60",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    court: "Cancha 3",
    date: "2023-05-17",
    amount: "55",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Ana Martínez",
    court: "Cancha 1",
    date: "2023-05-18",
    amount: "50",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "5",
    name: "Luis Sánchez",
    court: "Cancha 2",
    date: "2023-05-19",
    amount: "60",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
]