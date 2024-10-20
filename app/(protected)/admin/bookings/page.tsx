"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingList } from "../_components/booking-list"


export default function BookingsPage() {
  return (

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Reservas</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingList />
          </CardContent>
        </Card>
      </div>
   
  )
}