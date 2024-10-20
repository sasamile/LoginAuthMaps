"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportGenerator } from "../_components/report-generator"


export default function ReportsPage() {
  return (
  
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Generador de Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportGenerator />
          </CardContent>
        </Card>
      </div>
    
  )
}