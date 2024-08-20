import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // take & validate input
    .input(z.object({ configId: z.string().optional() }))
    // input it into middleware
    .middleware(async ({ input }) => {
      return { input };
    })
    // middle ware to handler, after image is completely uploaded
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;
      return { configId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
