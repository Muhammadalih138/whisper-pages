import { Editor } from "@/src/components/Editor";
import { authOptions } from "@/src/lib/auth";
import { connectToDatabase } from "@/src/lib/db";
import { Post } from "@/src/models/Post";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();
  const raw = await Post.findById(id).lean();

  if (!raw) {
    notFound();
  }

  const post = {
    _id: raw._id.toString(),
    title: raw.title as string,
    excerpt: raw.excerpt as string | undefined,
    content: raw.content as string,
    coverImage: raw.coverImage as string | undefined,
    status: raw.status as "draft" | "published",
    authorId: raw.authorId as string,
  };

  if (session.user.role !== "author" || post.authorId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <section className="writer-page">
      <div className="page-heading">
        <p className="eyebrow">Author studio</p>
        <h1>Edit post</h1>
      </div>
      <Editor
        post={{
          _id: post._id.toString(),
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          status: post.status,
        }}
      />
    </section>
  );
}
