"use client";

import React, { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";

const UploadPage = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    setIsDragOver(false);
    rejectedFiles.forEach((fileRejection) => {
      const { file, errors } = fileRejection;
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2); // Convert bytes to MB with two decimal places
      errors.forEach((error) => {
        if (error.code === "file-too-large") {
          toast({
            title: `File size exceeds limit`,
            description: `The file "${file.name}" is too large "${fileSizeInMB} MB". Please choose a file smaller than 4MB.`,
            variant: "destructive",
          });
        } else if (error.code === "file-invalid-type") {
          toast({
            title: `${file.type} type is not supported.`,
            description: "Please choose a PNG, JPG, or JPEG image instead.",
            variant: "destructive",
          });
        } else if (error.code === "too-many-files") {
          toast({
            title: `Too many files`,
            description: `You can only upload one file at a time.`,
            variant: `destructive`,
          });
        }
      });
    });
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles, { configId: undefined });

    setIsDragOver(false);
  };

  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "animate-fade-in transition300 relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center transition300",
        { "ring-blue-900/25 bg-blue-900/10": isDragOver }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          maxSize={4 * 1024 * 1024}
          maxFiles={1}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="size-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin size-6 text-zinc-500 mb-2" />
              ) : (
                <Image className="size-6 text-zinc-500 mb-2" />
              )}
              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      value={uploadProgress}
                      className="mt-2 w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center transition300">
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p className="">
                    <span className="font-semibold">Drop file </span>
                    to upload
                  </p>
                ) : (
                  <p className="">
                    <span className="font-semibold">Click to upload </span>
                    or drag and drop
                  </p>
                )}
              </div>
              {isPending ? null : (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default UploadPage;
