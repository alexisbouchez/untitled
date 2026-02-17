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

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#32;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function parseAtomFeed(xml: string): RedditPost[] {
  return xml
    .split("<entry>")
    .slice(1)
    .map((entry) => {
      const title = decodeEntities(
        entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""
      );
      const permalink =
        entry.match(/<link href="([^"]+)"/)?.[1] ?? "";
      const rawContent = decodeEntities(
        entry.match(/<content type="html">([\s\S]*?)<\/content>/)?.[1] ?? ""
      );
      const url =
        rawContent.match(/href="([^"]+)">\[link\]/)?.[1] ?? permalink;
      const selftext = (
        rawContent.match(/<div class="md">([\s\S]*?)<\/div>/)?.[1] ?? ""
      )
        .replace(/<[^>]+>/g, "")
        .trim()
        .slice(0, 300);

      return { title, score: 0, url, selftext, num_comments: 0, permalink };
    })
    .filter((p) => p.title);
}

async function fetchPosts(subreddit: string): Promise<RedditPost[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/top.rss?t=week&limit=15`,
    { headers: { "User-Agent": "Hyperbulletin/1.0" } },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch r/${subreddit}: ${res.status} ${res.statusText}`);
  }

  return parseAtomFeed(await res.text());
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
