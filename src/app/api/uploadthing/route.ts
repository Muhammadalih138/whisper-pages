import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "@/src/lib/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
