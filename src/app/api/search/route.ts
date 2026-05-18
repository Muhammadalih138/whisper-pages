import { connectToDatabase } from "@/src/lib/db";
import { Post } from "@/src/models/Post";

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return Response.json({ posts: [] });
  }

  const posts = await Post.find({
    status: "published",
    $or: [{ title: { $regex: query, $options: "i" } }, { content: { $regex: query, $options: "i" } }],
  })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({ posts });
}
