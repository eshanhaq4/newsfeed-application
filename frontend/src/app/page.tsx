"use client";

import Image from "next/image";
import styles from "./page.module.css";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  content: string;
  createdAt: string;
  likeCount: number;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchFeed(newCursor: string | null = null) {
    setLoading(true);

  const res = await fetch("http://127.0.0.1:8000/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Feed($cursor: String, $limit: Int) {
            feed(cursor: $cursor, limit: $limit) {
              posts {
                id
                content
                createdAt
                likeCount
              }
              nextCursor
            }
          }
        `,
        variables: {
          cursor: newCursor,
          limit: 5,
        },
      }),
    });

    const json = await res.json();
    const data = json.data.feed;

    if (newCursor) {
      setPosts((prev) => [...prev, ...data.posts]);
    } else {
      setPosts(data.posts);
    }

    setCursor(data.nextCursor);
    setLoading(false);
  }

  useEffect(() => {
    fetchFeed();
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
        </div>
      ))}

      {loading && <p>Loading...</p>}

      {cursor && !loading && (
        <button onClick={() => fetchFeed(cursor)} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
