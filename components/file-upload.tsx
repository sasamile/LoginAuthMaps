"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter, OurFileRouter } from "@/app/api/uploadthing/core";
import { Url } from "next/dist/shared/lib/router/router";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (urls: string[]) => void;
  endpoint: keyof typeof ourFileRouter;
 
}

export const FileUpload = ({
  onChange,
  endpoint,
 
}: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const urls = res?.map((file) => file.url) || [];
        onChange(urls);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
     
    />
  );
};
