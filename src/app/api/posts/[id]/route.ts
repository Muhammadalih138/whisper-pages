import { connectToDatabase } from "@/src/lib/db";
import { authOptions } from "@/src/lib/auth";
import { POST_BODY_WORD_LIMIT, countHtmlWords } from "@/src/lib/wordCount";
import { Post } from "@/src/models/Post";
import { getServerSession } from "next-auth";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/posts/[id]">,
) {
  await connectToDatabase();
  const { id } = await context.params;
  const post = await Post.findById(id).lean();

  if (!post) {
    return Response.json({ message: "Post not found" }, { status: 404 });
  }

  return Response.json({ post });
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/posts/[id]">,
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "author") {
    return Response.json({ message: "Only authors can edit posts." }, { status: 403 });
  }

  await connectToDatabase();
  const { id } = await context.params;
  const body = await request.json();
  const existingPost = await Post.findById(id);

  if (!existingPost) {
    return Response.json({ message: "Post not found" }, { status: 404 });
  }

  if (existingPost.authorId !== session.user.id) {
    return Response.json({ message: "You can only edit your own posts." }, { status: 403 });
  }

  const content = String(body.content ?? existingPost.content).trim();

  if (countHtmlWords(content) > POST_BODY_WORD_LIMIT) {
    return Response.json(
      { message: `Post body must be ${POST_BODY_WORD_LIMIT} words or fewer.` },
      { status: 400 },
    );
  }

  const post = await Post.findByIdAndUpdate(
    id,
    {
      title: String(body.title ?? existingPost.title).trim(),
      content,
      excerpt: String(body.excerpt ?? existingPost.excerpt ?? ""),
      coverImage: String(body.coverImage ?? existingPost.coverImage ?? ""),
      status: body.status === "published" ? "published" : "draft",
    },
    { new: true },
  ).lean();

  if (!post) {
    return Response.json({ message: "Post not found" }, { status: 404 });
  }

  return Response.json({ post });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/posts/[id]">,
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "author") {
    return Response.json({ message: "Only authors can delete posts." }, { status: 403 });
  }

  await connectToDatabase();
  const { id } = await context.params;
  const existingPost = await Post.findById(id);

  if (!existingPost) {
    return Response.json({ message: "Post not found" }, { status: 404 });
  }

  if (existingPost.authorId !== session.user.id) {
    return Response.json(
      { message: "You can only delete your own posts." },
      { status: 403 },
    );
  }

  await Post.findByIdAndDelete(id);

  return Response.json({ ok: true });
}
