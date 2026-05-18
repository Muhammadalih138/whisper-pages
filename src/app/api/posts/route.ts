import { connectToDatabase } from "@/src/lib/db";
import { authOptions } from "@/src/lib/auth";
import { POST_BODY_WORD_LIMIT, countHtmlWords } from "@/src/lib/wordCount";
import { Post } from "@/src/models/Post";
import { getServerSession } from "next-auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET(request: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const mine = searchParams.get("mine") === "true";
  const filter =
    mine && session?.user.id
      ? { authorId: session.user.id }
      : { status: "published" };

  const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();

  return Response.json({ posts });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "author") {
    return Response.json({ message: "Only authors can create posts." }, { status: 403 });
  }

  await connectToDatabase();
  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const status = body.status === "published" ? "published" : "draft";

  if (!title || !content) {
    return Response.json(
      { message: "Title and content are required." },
      { status: 400 },
    );
  }

  if (countHtmlWords(content) > POST_BODY_WORD_LIMIT) {
    return Response.json(
      { message: `Post body must be ${POST_BODY_WORD_LIMIT} words or fewer.` },
      { status: 400 },
    );
  }

  const baseSlug = slugify(title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const post = await Post.create({
    title,
    slug,
    content,
    excerpt: String(body.excerpt ?? content.replace(/<[^>]+>/g, "").slice(0, 150)),
    coverImage: String(body.coverImage ?? ""),
    authorId: session.user.id,
    authorName: session.user.name,
    status,
  });

  return Response.json({ post }, { status: 201 });
}
