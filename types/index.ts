import { JsonValue } from "@prisma/client/runtime/library";

export interface Cancha {
  id: string;
  name: string;
  address: string;
  description: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  price: number;
  imageUrl: string;
  coordinates: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Reserva {
  id: number;
  canchaId: number;
  fechaInicio: Date;
  fechaFin: Date;
  usuario: string;
}

export type UploadFileResponse =
  | { data: UploadData; error: null }
  | { data: null; error: UploadError };

export type UploadData = {
  key: string;
  url: string;
  name: string;
  size: number;
};

export type UploadError = {
  code: string;
  message: string;
  data?: any;
};


export interface PSETransaction {
  bankCode: string;
  reference: string;
  description: string;
  amount: number;
  currency: string;
  email: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
}