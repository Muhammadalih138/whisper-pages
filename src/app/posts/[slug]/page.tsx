import { CommentSection } from "@/src/components/CommentSection";
import { LikeButton } from "@/src/components/LikeButton";
import { connectToDatabase } from "@/src/lib/db";
import { Post } from "@/src/models/Post";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();
  const rawPost = await Post.findOne({ slug, status: "published" }).lean();

  if (!rawPost) {
    notFound();
  }

  const post = {
    _id: rawPost._id.toString(),
    title: rawPost.title as string,
    content: rawPost.content as string,
    coverImage: rawPost.coverImage as string | undefined,
    authorName: rawPost.authorName as string | undefined,
    likes: (rawPost.likes as number) ?? 0,
  };

  return (
    <article className="post-detail">
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="post-cover" src={post.coverImage} alt="" />
      )}
      <div className="post-header">
        <p className="eyebrow">By {post.authorName ?? "Whisper author"}</p>
        <h1>{post.title}</h1>
        <LikeButton postId={post._id} initialLikes={post.likes} />
      </div>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      <CommentSection postId={post._id} />
    </article>
  );
}
