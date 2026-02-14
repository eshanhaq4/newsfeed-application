"use client";

import { useEffect, useState } from "react";
import { Post, fetchFeed, toggleLike, createPost, deletePost, editPost } from "../lib/api";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");
  
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
        setPosts((prev) => 
            prev.map((post) => 
                post.id === resultPost.id ? resultPost : post
        )
    );
  }

  async function handleCreatePost() {
    if (!newPost.trim()) 
        return;

    const createdPost = await createPost(1, newPost); // Hardcoded user ID

    setPosts((prev) => [createdPost, ...prev]);
    setNewPost("");
  }

  async function handleEditPost(postId: number) {
    if (!editedContent.trim()) 
        return;

    const editedPost = await editPost(postId, editedContent);

    setPosts((prev) => 
        prev.map((post) => 
            post.id === editedPost.id ? editedPost : post
        )
    );
    setEditingPostId(null);
    setEditedContent("");
  }

  async function handleDeletePost(postId: number) {
    const deleted = await deletePost(postId);
    setPosts((prev) => prev.filter((post) => deleted !== post.id));
  }

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div style={{ 
        maxWidth: "600px", 
        margin: "0 auto",
        padding: "2rem" }}>
      <h1>Newsfeed</h1>
        <div style={{ marginBottom: "1rem" }}>
            <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                style={{ 
                    width: "100%", 
                    padding: "0.5rem",
                    color: "#d7dcd6",
                    backgroundColor: "#2e0b2e",
                    border: "1px solid #d7dcd6",
                    borderRadius: "4px", 
                }}
            />
            <button onClick={handleCreatePost} style={{ marginTop: "0.5rem" }}>
                Post
            </button>
        </div>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            backgroundColor: "#2e0b2e",
            border: "1px solid #d7dcd6",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
        {editingPostId === post.id ? (
            <>
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem" }}
                />
                <button onClick={() => handleEditPost(post.id)} style={{ marginTop: "0.5rem" }}>
                    Save
                </button>
                <button onClick={() => setEditingPostId(null)} style={{ marginLeft: "0.5rem" }}>
                    Cancel
                </button>
            </>
        ) : (
            <p>{post.content}</p>
        )}
          <p>
            <small>
              Posted at: {new Date(post.createdAt).toLocaleString()} | Likes ❤️ {post.likeCount}
            </small>
          </p>
          <button onClick={() => handleLikes(post.id)} 
            style={{ 
                marginRight: "0.5rem",
                cursor: "pointer",
            }}>
            Like
            </button>
          <button onClick={() => {setEditingPostId(post.id); setEditedContent(post.content);}}
            style={{ 
                cursor: "pointer" 
            }}>
            Edit
            </button>
          <button onClick={() => handleDeletePost(post.id)} 
            style={{ 
                marginLeft: "0.5rem", 
                cursor: "pointer", 
            }}>
            Delete
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
