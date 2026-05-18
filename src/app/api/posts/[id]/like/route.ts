import { connectToDatabase } from "@/src/lib/db";
import { Post } from "@/src/models/Post";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/posts/[id]/like">,
) {
  await connectToDatabase();
  const { id } = await context.params;
  const post = await Post.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true },
  ).lean();

  if (!post) {
    return Response.json({ message: "Post not found" }, { status: 404 });
  }

  return Response.json({ post });
}
