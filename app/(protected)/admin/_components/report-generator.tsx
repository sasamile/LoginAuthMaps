"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function ReportGenerator() {
  const [reportType, setReportType] = useState("")
  const [month, setMonth] = useState<string>("")
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())

  const generatePDF = () => {
    // Aquí iría la lógica para generar el PDF
    console.log("Generando PDF:", { reportType, month, year })
  }

  return (
    <div className="space-y-4">
      <Select onValueChange={setReportType}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione el tipo de reporte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bookings">Reservas</SelectItem>
          <SelectItem value="income">Ingresos</SelectItem>
          <SelectItem value="occupancy">Ocupación</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex space-x-4">
        <Select onValueChange={setMonth}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el mes" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setYear} defaultValue={year}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el año" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={generatePDF}>Generar PDF</Button>
    </div>
  )
}