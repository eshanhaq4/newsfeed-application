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