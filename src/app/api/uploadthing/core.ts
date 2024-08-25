import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Define and validate the expected input using zod
    .input(z.object({ configId: z.string().optional() }))
    // Middleware to process the validated input before uploading
    .middleware(async ({ input }) => {
      return { input };
    })
    // This handler is executed after the image is successfully uploaded
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;

      // Fetch the uploaded image from the URL provided by Uploadthing
      const res = await fetch(file.url);
      // Convert the fetched image to a buffer for processing
      const buffer = await res.arrayBuffer();
      // Use sharp to retrieve the image metadata, such as width and height
      const imgMetadata = await sharp(buffer).metadata();
      const { width, height } = imgMetadata;

      // If no configId is provided, create a new configuration entry in the database
      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            imgUrl: file.url,
            height: height || 500, // Default to 500 if no height is found
            width: width || 500, // Default to 500 if no width is found
          },
        });
        // Return the ID of the newly created configuration
        return { configId: configuration.id };
      } else {
        // If a configId exists, it indicates the user is uploading or designed their cropped image
        // Update the existing configuration with the new cropped image URL
        const updatedConfiguration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        });
        // Return the ID of the updated configuration
        return { configId: updatedConfiguration.id };
      }
    }),
} satisfies FileRouter; // Ensure the object matches the FileRouter type definition

export type OurFileRouter = typeof ourFileRouter;
