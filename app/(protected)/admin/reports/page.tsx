"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileTextIcon, DownloadIcon } from "lucide-react";
import { getReportData } from "@/actions/report-actions";


export default function ReportGenerator() {
  const [reportType, setReportType] = useState("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [day, setDay] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const styles = StyleSheet.create({
    page: { 
      padding: 40,
      backgroundColor: "#ffffff" 
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      color: "#1a365d",
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 15,
      color: "#2d3748",
    },
    table: { 
      width: "100%", 
      borderStyle: "solid", 
      borderWidth: 1,
      borderColor: "#e2e8f0",
      marginTop: 20,
    },
    tableRow: { 
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
      minHeight: 35,
      alignItems: 'center',
    },
    tableHeader: {
      backgroundColor: "#f7fafc",
      width: "25%",
      padding: 8,
      fontSize: 12,
      fontWeight: 'bold',
      color: "#2d3748",
    },
    tableCell: { 
      width: "25%",
      padding: 8,
      fontSize: 10,
      color: "#4a5568",
    },
    summary: {
      marginTop: 30,
      fontSize: 14,
      fontWeight: 'bold',
      color: "#2d3748",
      textAlign: 'right',
    }
  });

  const ReportDocument = ({ data }: any) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {reportType === "bookings" && "Reporte de Reservas"}
          {reportType === "income" && "Reporte de Ingresos"}
          {reportType === "occupancy" && "Reporte de Ocupación"}
        </Text>
        <Text style={styles.subtitle}>
          Fecha: {new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>

        {reportType === "bookings" && (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Fecha</Text>
              <Text style={styles.tableHeader}>Cancha</Text>
              <Text style={styles.tableHeader}>Cliente</Text>
              <Text style={styles.tableHeader}>Estado</Text>
            </View>
            {data?.map((reservation: any) => (
              <View style={styles.tableRow} key={reservation.id}>
                <Text style={styles.tableCell}>
                  {new Date(reservation.date).toLocaleDateString()}
                </Text>
                <Text style={styles.tableCell}>{reservation.court.name}</Text>
                <Text style={styles.tableCell}>
                  {reservation.user.name} {reservation.user.lastname}
                </Text>
                <Text style={styles.tableCell}>{reservation.status}</Text>
              </View>
            ))}
          </View>
        )}

        {reportType === "income" && data && (
          <>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Cancha</Text>
                <Text style={styles.tableHeader}>Cliente</Text>
                <Text style={styles.tableHeader}>Horas</Text>
                <Text style={styles.tableHeader}>Monto</Text>
              </View>
              {data.reservations?.map((reservation: any) => (
                <View style={styles.tableRow} key={reservation.id}>
                  <Text style={styles.tableCell}>{reservation.court.name}</Text>
                  <Text style={styles.tableCell}>
                    {reservation.user.name} {reservation.user.lastname}
                  </Text>
                  <Text style={styles.tableCell}>{reservation.totalHours}</Text>
                  <Text style={styles.tableCell}>${reservation.totalPrice}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.summary}>
              Total del día: ${data.summary.totalIncome}
            </Text>
          </>
        )}

        {reportType === "occupancy" && data && (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Cancha</Text>
              <Text style={styles.tableHeader}>Reservas</Text>
              <Text style={styles.tableHeader}>Ocupación</Text>
            </View>
            {data.map((item: any) => (
              <View style={styles.tableRow} key={item.courtName}>
                <Text style={styles.tableCell}>{item.courtName}</Text>
                <Text style={styles.tableCell}>{item.reservations}</Text>
                <Text style={styles.tableCell}>{item.occupancyRate.toFixed(1)}%</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      const reportData = await getReportData(reportType, month, day, year);
      const blob = await pdf(<ReportDocument data={reportData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${reportType}-${day}-${month}-${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canDownload = reportType && month && day && year;

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg bg-muted/50">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 border-b pb-4">
            <FileTextIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">
              Generador de Reportes
            </h1>
          </div>

          <div className="grid gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de Reporte
              </label>
              <Select onValueChange={setReportType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bookings">Reservas</SelectItem>
                  <SelectItem value="income">Ingresos</SelectItem>
                  <SelectItem value="occupancy">Ocupación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Mes
                </label>
                <Select onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {new Date(0, m - 1).toLocaleString("es", { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Día
                </label>
                <Select onValueChange={setDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el día" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Año
                </label>
                <Select onValueChange={setYear} defaultValue={year}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el año" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              {canDownload ? (
                isClient && (
                  <Button
                    className="w-full md:w-auto"
                    onClick={handleGenerateReport}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generando documento...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <DownloadIcon className="h-4 w-4" />
                        <span>Descargar Reporte PDF</span>
                      </div>
                    )}
                  </Button>
                )
              ) : (
                <div className="text-center p-4  rounded-lg border">
                  <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Seleccione todos los campos para generar el reporte
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}