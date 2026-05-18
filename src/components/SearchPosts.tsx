"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";

type SearchResult = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  authorName?: string;
};

export function SearchPosts() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  async function handleSearch(value: string) {
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    const data = await response.json();
    setResults(data.posts ?? []);
  }

  return (
    <section className="search-panel" aria-label="Search posts">
      <div className="search-box">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search published stories..."
        />
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post._id}>
              <strong>{post.title}</strong>
              <span>{post.excerpt || `By ${post.authorName ?? "an author"}`}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
