import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { connectToDatabase } from "@/src/lib/db";
import { Post } from "@/src/models/Post";
import { DeletePostButton } from "@/src/components/DeletePostButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role ?? "reader";
  const posts =
    role === "author"
      ? await (async () => {
          await connectToDatabase();
          const raw = await Post.find({ authorId: session.user.id })
            .sort({ createdAt: -1 })
            .lean();
          return raw.map((p) => ({
            _id: p._id.toString(),
            title: p.title as string,
            slug: p.slug as string,
            status: p.status as "draft" | "published",
            likes: (p.likes as number) ?? 0,
          }));
        })()
      : [];

  return (
    <section className="dashboard-shell">
      <div className="page-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Welcome back, {session.user.name}</h1>
        <p>
          Your account is currently set as <strong>{role}</strong>. Your tools
          below are tailored to that role.
        </p>
      </div>

      <div className="dashboard-grid">
        <article className="metric-card">
          <span>Role</span>
          <strong>{role}</strong>
        </article>
        <article className="metric-card">
          <span>Drafts</span>
          <strong>0</strong>
        </article>
        <article className="metric-card">
          <span>Responses</span>
          <strong>0</strong>
        </article>
      </div>

      <div className="tool-panel">
        <div>
          <h2>
            {role === "reader" ? "Reader space" : "Author studio"}
          </h2>
          <p>
            {role === "reader"
              ? "Browse posts and join conversations as the library grows."
              : "Create a new post, shape a draft, and publish when it is ready."}
          </p>
        </div>
        {role !== "reader" && (
          <Link className="button button-primary" href="/dashboard/create">
            Create post
          </Link>
        )}
      </div>

      {role === "author" && (
        <section className="post-table">
          <div className="section-heading">
            <p className="eyebrow">Content workflow</p>
            <h2>Your posts</h2>
          </div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <article className="post-row" key={post._id}>
                <div>
                  <span>{post.status}</span>
                  <h3>{post.title}</h3>
                  <p>{post.likes ?? 0} likes</p>
                </div>
                <div className="row-actions">
                  {post.status === "published" && (
                    <Link className="icon-button" href={`/posts/${post.slug}`}>
                      View
                    </Link>
                  )}
                  <Link className="icon-button" href={`/dashboard/edit/${post._id}`}>
                    Edit
                  </Link>
                  <DeletePostButton postId={post._id} />
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>No drafts yet</h3>
              <p>Create a post and choose whether to save it as a draft or publish it.</p>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
