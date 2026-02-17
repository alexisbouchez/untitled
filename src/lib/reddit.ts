import { tool } from "@langchain/core/tools";
import { z } from "zod";

interface RedditPost {
  title: string;
  score: number;
  url: string;
  selftext: string;
  num_comments: number;
  permalink: string;
}

async function fetchPosts(subreddit: string): Promise<RedditPost[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/top.json?t=week&limit=15`,
    { headers: { "User-Agent": "Hyperbulletin/1.0" } },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch r/${subreddit}: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.data.children.map((child: { data: RedditPost }) => ({
    title: child.data.title,
    score: child.data.score,
    url: child.data.url,
    selftext: child.data.selftext?.slice(0, 300) || "",
    num_comments: child.data.num_comments,
    permalink: `https://reddit.com${child.data.permalink}`,
  }));
}

export async function fetchRedditPostsRaw(subreddit: string) {
  return fetchPosts(subreddit);
}

export const fetchRedditPosts = tool(
  async ({ subreddit }: { subreddit: string }) => {
    try {
      const posts = await fetchPosts(subreddit);
      return JSON.stringify(posts, null, 2);
    } catch (error) {
      return String(error);
    }
  },
  {
    name: "fetch_reddit_posts",
    description:
      "Fetches the top posts from the past week for a given subreddit. Returns a JSON array of posts with title, score, url, selftext preview, num_comments, and permalink.",
    schema: z.object({
      subreddit: z
        .string()
        .describe("The subreddit name without the r/ prefix"),
    }),
  },
);
