"use server";

import { formatImageUrl } from "@/lib/format-url";
import { utapi } from "./uploadthing";

import { FileEsque, UploadFileResult } from "uploadthing/types";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as FileEsque;

    const response: UploadFileResult = await utapi.uploadFiles(file);

    if (response.data) {
      return { success: true, fileUrl: response.data.url };
    }

    return { success: false, fileUrl: null };
  } catch (error) {
    console.log("Error al subir la imagen");
  }
}


export async function deleteImageFile(imageUrl: string) {
  try {
    const newImageUrl = formatImageUrl(imageUrl);
    const response = await utapi.deleteFiles(newImageUrl);

    return { success: response.success };
  } catch (error) {
    console.log(error);
  }
}
