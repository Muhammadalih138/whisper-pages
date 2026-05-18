"use client";

import { ImageUpload } from "@/src/components/ImageUpload";
import { POST_BODY_WORD_LIMIT, countHtmlWords } from "@/src/lib/wordCount";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditorPost = {
  _id?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  status?: "draft" | "published";
};

type EditorProps = {
  post?: EditorPost;
};

export function Editor({ post }: EditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(() => countHtmlWords(post?.content ?? ""));
  const editor = useEditor({
    extensions: [StarterKit],
    content: post?.content ?? "<p>Start your story...</p>",
    immediatelyRender: false,
    onUpdate({ editor: activeEditor }) {
      setWordCount(countHtmlWords(activeEditor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: "rich-editor-surface",
      },
    },
  });

  async function savePost(status: "draft" | "published") {
    setError("");
    setIsSubmitting(true);

    const content = editor?.getHTML() ?? "";
    const nextWordCount = countHtmlWords(content);

    if (nextWordCount > POST_BODY_WORD_LIMIT) {
      setError(`Post body must be ${POST_BODY_WORD_LIMIT} words or fewer.`);
      setIsSubmitting(false);
      return;
    }

    const response = await fetch(post?._id ? `/api/posts/${post._id}` : "/api/posts", {
      method: post?._id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, excerpt, coverImage, content, status }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.message ?? "Could not save this post.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      className="editor-form"
      onSubmit={(event) => {
        event.preventDefault();
        savePost("draft");
      }}
    >
      <div className="editor-grid">
        <div className="editor-main">
          <label>
            Title
            <input
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label>
            Short excerpt
            <textarea
              name="excerpt"
              rows={3}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
            />
          </label>

          <div className="rich-editor">
            <div className="editor-toolbar">
              <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>
                B
              </button>
              <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>
                I
              </button>
              <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                H2
              </button>
              <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                List
              </button>
              <span className={wordCount > POST_BODY_WORD_LIMIT ? "word-count word-count-error" : "word-count"}>
                {wordCount}/{POST_BODY_WORD_LIMIT} words
              </span>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        <aside className="editor-sidebar">
          <ImageUpload value={coverImage} onChange={setCoverImage} />
          <div className="publish-box">
            <span>Status</span>
            <strong>{post?.status ?? "new draft"}</strong>
            {error && <p className="form-error">{error}</p>}
            <button className="button button-ghost button-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save draft"}
            </button>
            <button
              className="button button-primary button-full"
              type="button"
              disabled={isSubmitting}
              onClick={() => savePost("published")}
            >
              Publish
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}
