import Link from "next/link";
import { ArrowRight, Feather, ShieldCheck, UsersRound } from "lucide-react";
import { connectToDatabase } from "@/src/lib/db";
import { Post } from "@/src/models/Post";
import { SearchPosts } from "@/src/components/SearchPosts";

export const dynamic = "force-dynamic";

type PublishedPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  authorName?: string;
};

async function getPublishedPosts() {
  await connectToDatabase();
  return Post.find({ status: "published" })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean<PublishedPost[]>();
}

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Private drafts. Public stories. Clear roles.</p>
          <h1>Write quieter, publish smarter, and keep every voice in its place.</h1>
          <p className="hero-text">
            Whisper Pages gives readers a refined space to discover posts and
            authors a calm desk to draft, publish, and manage their work.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary button-large" href="/signup">
              Start writing
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-ghost button-large" href="/login">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="hero-panel" aria-label="Featured story preview">
          <div className="story-window">
            <div className="window-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="story-lines">
              <strong>The night library</strong>
              <span />
              <span />
              <span />
              <span className="short-line" />
            </div>
          </div>
          <div className="floating-note">
            <Feather size={18} aria-hidden="true" />
            Draft saved
          </div>
        </div>
      </section>

      <SearchPosts />

      <section className="feature-grid" aria-label="Platform highlights">
        <article className="feature-card">
          <Feather size={22} aria-hidden="true" />
          <h2>Writer studio</h2>
          <p>Create and edit posts from a distraction-light dashboard.</p>
        </article>
        <article className="feature-card">
          <UsersRound size={22} aria-hidden="true" />
          <h2>Reader community</h2>
          <p>Let readers explore stories, comment, and like what resonates.</p>
        </article>
        <article className="feature-card">
          <ShieldCheck size={22} aria-hidden="true" />
          <h2>Role control</h2>
          <p>Assign reader, writer, or admin access right when users sign up.</p>
        </article>
      </section>

      <section className="post-section">
        <div className="section-heading">
          <p className="eyebrow">Published posts</p>
          <h2>Fresh from the community</h2>
        </div>
        <div className="post-grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link className="post-card" href={`/posts/${post.slug}`} key={post._id}>
                <span>{post.authorName ?? "Whisper author"}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt ?? "Open the post to keep reading."}</p>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <h3>No published posts yet</h3>
              <p>Sign up as an author and publish the first story.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
