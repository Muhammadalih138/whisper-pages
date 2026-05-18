"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeletePostButtonProps = {
  postId: string;
};

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    setIsDeleting(false);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <button className="icon-button danger-button" type="button" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 size={16} aria-hidden="true" />
      <span>{isDeleting ? "Deleting" : "Delete"}</span>
    </button>
  );
}
