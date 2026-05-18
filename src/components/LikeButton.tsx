"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

type LikeButtonProps = {
  postId: string;
  initialLikes?: number;
};

export function LikeButton({ postId, initialLikes = 0 }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  async function handleLike() {
    setIsLiking(true);
    const response = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    setIsLiking(false);

    if (response.ok) {
      setLikes((value) => value + 1);
    }
  }

  return (
    <button className="button button-ghost" type="button" onClick={handleLike} disabled={isLiking}>
      <Heart size={16} aria-hidden="true" />
      {likes}
    </button>
  );
}
