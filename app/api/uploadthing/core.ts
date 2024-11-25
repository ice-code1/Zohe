import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

// Create an instance of Uploadthing
const f = createUploadthing();

// Function to get the current user
const getUser = async () => await currentUser();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  media: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url:", file.url);

      // Return necessary data that you want to send back to the client
      return { fileUrl: file.url }; // Ensure this is correctly structured
    }),
} satisfies FileRouter; // Ensure ourFileRouter satisfies the FileRouter type

// Export the type for use in other files
export type OurFileRouter = typeof ourFileRouter;
