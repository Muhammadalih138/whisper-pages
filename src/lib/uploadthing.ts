import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  coverImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return {
        url: file.ufsUrl,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
