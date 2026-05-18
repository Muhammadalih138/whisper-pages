"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type CommentSectionProps = {
  postId: string;
};

type Comment = {
  _id: string;
  authorName?: string;
  content: string;
};

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((response) => response.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => setComments([]));
  }, [postId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Could not add your comment.");
      return;
    }

    setComments((items) => [data.comment, ...items]);
    setContent("");
  }

  return (
    <section className="comments-panel" aria-label="Comments">
      <h2>Comments</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="comment"
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Add a thoughtful response..."
        />
        {error && <p className="form-error">{error}</p>}
        <button className="button button-primary" type="submit">
          Add comment
        </button>
      </form>
      <div className="comment-list">
        {comments.map((comment) => (
          <article className="comment-item" key={comment._id}>
            <strong>{comment.authorName ?? "Reader"}</strong>
            <p>{comment.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
