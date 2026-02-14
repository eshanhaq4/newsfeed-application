export type Post = {
  id: number;
  content: string;
  createdAt: string;
  likeCount: number;
};

export type FeedResponse = {
  posts: Post[];
  nextCursor: string | null;
};

export async function fetchFeed(newCursor: string | null = null): Promise<FeedResponse> {
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

    return json.data.feed;
}

export async function toggleLike(postId: number, userId: number): Promise<Post> {
  const res = await fetch("http://127.0.0.1:8000/graphql/", { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation ToggleLike($postId: Int!, $userId: Int!) {
          toggleLike(postId: $postId, userId: $userId) {
            id
            content
            createdAt
            likeCount
          }
        }
      `,
      variables: {
        postId,
        userId,
      },
    }),
  });

  const json = await res.json();
  
  return json.data.toggleLike;
}

export async function createPost(creatorId: number, content: string): Promise<Post> {
  const res = await fetch("http://127.0.0.1:8000/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation CreatePost($creatorId: Int!, $content: String!) {
          createPost(creatorId: $creatorId, content: $content) {
            id
            content
            createdAt
            likeCount
          }
        }
      `,
      variables: {
        content,
        creatorId,
      },
    }),
  });
  
  const json = await res.json();
  return json.data.createPost;
}

export async function deletePost(postId: number): Promise<number> {
  const res = await fetch("http://127.0.0.1:8000/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation DeletePost($postId: Int!) {
          deletePost(postId: $postId)
        }
      `,
      variables: {
        postId,
      },
    }),
  });

  const json = await res.json();
  return json.data.deletePost;
}
