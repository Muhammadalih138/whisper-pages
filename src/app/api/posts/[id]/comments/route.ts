import { connectToDatabase } from "@/src/lib/db";
import { authOptions } from "@/src/lib/auth";
import { Comment } from "@/src/models/Comment";
import { getServerSession } from "next-auth";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/posts/[id]/comments">,
) {
  await connectToDatabase();
  const { id } = await context.params;
  const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 }).lean();

  return Response.json({ comments });
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/posts/[id]/comments">,
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Login to comment." }, { status: 401 });
  }

  await connectToDatabase();
  const { id } = await context.params;
  const body = await request.json();
  const content = String(body.content ?? "").trim();

  if (!content) {
    return Response.json({ message: "Comment cannot be empty." }, { status: 400 });
  }

  const comment = await Comment.create({
    postId: id,
    content,
    authorId: session.user.id,
    authorName: session.user.name,
  });

  return Response.json({ comment }, { status: 201 });
}
