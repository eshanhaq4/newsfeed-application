"use client";

import { useEffect, useState } from "react";
import { Post, fetchFeed, toggleLike } from "../lib/api";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  async function loadFeed(newCursor: string | null = null) {
    setLoading(true);

    const data = await fetchFeed(newCursor);

    if (newCursor) {
      setPosts((prev) => [...prev, ...data.posts]);
    } else {
      setPosts(data.posts);
    }

    setCursor(data.nextCursor);
    setLoading(false);
  }

  async function handleLikes(postId: number) {
    // For simplicity, hardcoded user ID here.
    const resultPost = await toggleLike(postId, 1);
      // Update the like count in the UI
        setPosts((prev) => 
            prev.map((post) => 
                post.id === resultPost.id ? resultPost : post
        )
    );
  }

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Newsfeed</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid black",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p>{post.content}</p>
          <p>
            <small>
              Posted at: {new Date(post.createdAt).toLocaleString()} | Likes: {post.likeCount}
            </small>
          </p>
          <button onClick={() => handleLikes(post.id)}>
            Like
            </button>
        </div>
      ))}

      {loading && <p>Loading...</p>}

      {cursor && !loading && (
        <button onClick={() => loadFeed(cursor)} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
