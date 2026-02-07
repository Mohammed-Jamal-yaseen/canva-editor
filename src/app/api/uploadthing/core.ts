/** @format */
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();

// Robust middleware to handle better-auth session
const authMiddleware = async (req: Request) => {
    // const session = await auth.api.getSession({ headers: req.headers });
    
    // if (!session || !session.user) {
    //     throw new UploadThingError("Unauthorized");
    // }

        // if (!session.user.emailVerified) {
    //     throw new UploadThingError("Email not verified. Please verify your email to upload files.");
    // }

    return { userId: "1" };
};

export const ourFileRouter = {
    // --- Primary Image Uploader (Shared/Profile/Brands) ---
    primaryImage: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
    })
    .middleware(async ({ req }) => await authMiddleware(req))
    .onUploadComplete(({ metadata, file }) => {
        return { uploadedBy: metadata.userId, url: file.url, name: file.name, type: file.type };
    }),

    // --- Assets Manager: Specific Routes ---
    imageUploader: f({
        image: { maxFileSize: "16MB", maxFileCount: 1 },
    })
    .middleware(async ({ req }) => await authMiddleware(req))
    .onUploadComplete(({ metadata, file }) => {
        return { uploadedBy: metadata.userId, url: file.url, name: file.name, type: file.type };
    }),

    videoUploader: f({
        video: { maxFileSize: "128MB", maxFileCount: 1 },
    })
    .middleware(async ({ req }) => await authMiddleware(req))
    .onUploadComplete(({ metadata, file }) => {
        return { uploadedBy: metadata.userId, url: file.url, name: file.name, type: file.type };
    }),

    audioUploader: f({
        audio: { maxFileSize: "32MB", maxFileCount: 1 },
    })
    .middleware(async ({ req }) => await authMiddleware(req))
    .onUploadComplete(({ metadata, file }) => {
        return { uploadedBy: metadata.userId, url: file.url, name: file.name, type: file.type };
    }),

    docUploader: f({
        pdf: { maxFileSize: "16MB", maxFileCount: 1 },
        text: { maxFileSize: "16MB", maxFileCount: 1 },
        blob: { maxFileSize: "16MB", maxFileCount: 1 }, // Supports all other document/binary files
    })
    .middleware(async ({ req }) => await authMiddleware(req))
    .onUploadComplete(({ metadata, file }) => {
        return { uploadedBy: metadata.userId, url: file.url, name: file.name, type: file.type };
    }),

    // --- Generic / Misc Routes ---
    resumeUploader: f({
        pdf: { maxFileSize: "4MB", maxFileCount: 1 },
        blob: { maxFileSize: "4MB", maxFileCount: 1 },
    })
    .middleware(async ({ req }) => await authMiddleware(req))
    .onUploadComplete(({ file }) => ({ url: file.url, name: file.name })),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
