"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export default function ReportGenerator() {
  const [reportType, setReportType] = useState("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [day, setDay] = useState<string>("");

  const styles = StyleSheet.create({
    page: { flexDirection: "row", backgroundColor: "#E4E4E4" },
    section: { margin: 10, padding: 10, flexGrow: 1 },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Reporte de {reportType || "Tipo no seleccionado"}</Text>
          <Text>
            Mes: {month || "Mes no seleccionado"}, Día:{" "}
            {day || "Día no seleccionado"}, Año: {year || "Año no seleccionado"}
          </Text>
        </View>
      </Page>
    </Document>
  );

  const canDownload = reportType && month && day && year;

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
                {new Date(0, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      {canDownload ? (
        <PDFDownloadLink document={<MyDocument />} fileName="reporte.pdf">
          {/* {({ blob, url, loading, error }) =>
            loading ? <span>Cargando documento...</span> :
            error ? <span>Error al cargar el documento</span> :
            <a href={url}>Descargar PDF</a>
          } */}
        </PDFDownloadLink>
      ) : (
        <span>Seleccione todos los campos para generar el reporte</span>
      )}
    </div>
  );
}
