"use server";

import { createDeepAgent } from "deepagents";
import { ChatOllama } from "@langchain/ollama";
import { z } from "zod";
import { fetchRedditPosts, fetchRedditPostsRaw } from "@/lib/reddit";
import { sendNewsletter } from "@/lib/email";
import { wrapNewsletter, STYLE_GUIDE } from "@/lib/newsletter-template";

const NEWSLETTER_PROMPT = `You write weekly digest newsletters for subreddit communities.

You receive raw Reddit post data. You return email-ready HTML content fragments.

STRUCTURE:
1. Lead story — the week's biggest post. Bold headline, 2-3 sentences on why it matters. Use highlight box styling.
2. Themed sections — group the rest by topic (e.g. "Announcements", "Show & Tell", "Discussions", "Resources"). 2-4 sections max. Not every post makes the cut.
3. Quick Links — a short bullet list of remaining noteworthy posts. Title + link, nothing else.

WRITING RULES:
- Every sentence must earn its place. If it doesn't inform or add context, cut it.
- Rewrite Reddit titles to be clear and specific. "Check this out" becomes "Open-source auth library hits 10k stars".
- One line per post explaining why a reader should care. No summaries of the obvious.
- State facts. Skip hype, hedging, and filler.
- BANNED phrases: "dive into", "let's dive", "exciting", "game-changer", "it's worth noting", "in this edition", "without further ado", "stay tuned", "happy reading", "we've got", "a]lot to unpack", "there you have it". If you use any of these, the output is wrong.
- No intros, no sign-offs, no "welcome to this week's edition". Start directly with the lead story.
- Tone: direct, useful, slightly dry. Like release notes written by someone with taste.

OUTPUT FORMAT:
- Raw HTML fragments only. No <!DOCTYPE>, <html>, <head>, <body> wrappers.
- No markdown. No code fences. No backticks.
- Inline styles only. No <style> blocks, no classes, no external CSS.
- No border-radius anywhere. Sharp corners only.
- Use these exact inline style patterns:
${STYLE_GUIDE}`;

const inputSchema = z.object({
  subreddit: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, { error: "Invalid subreddit name" }),
  email: z.string().email("Invalid email address"),
});

function stripCodeFences(text: string): string {
  return text.replace(/^```html?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
}

async function generateWithOllama(subreddit: string): Promise<string> {
  const posts = await fetchRedditPostsRaw(subreddit);
  const model = new ChatOllama({
    model: process.env.OLLAMA_MODEL!,
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  });

  const response = await model.invoke([
    { role: "system", content: NEWSLETTER_PROMPT },
    {
      role: "user",
      content: `Here are the top posts from r/${subreddit} this week:\n\n${JSON.stringify(posts, null, 2)}\n\nWrite the newsletter content now. Remember: HTML fragments only, inline styles only, no wrapper elements.`,
    },
  ]);

  const raw =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  return stripCodeFences(raw);
}

async function generateWithDeepAgent(subreddit: string): Promise<string> {
  const agent = createDeepAgent({
    systemPrompt: NEWSLETTER_PROMPT,
    tools: [fetchRedditPosts],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: `Create newsletter content for the subreddit: ${subreddit}. Remember: HTML fragments only, inline styles only, no wrapper elements.`,
      },
    ],
  });

  const lastMessage = result.messages[result.messages.length - 1];
  const raw =
    typeof lastMessage.content === "string"
      ? lastMessage.content
      : JSON.stringify(lastMessage.content);

  return stripCodeFences(raw);
}

export async function generateSample(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData,
) {
  const raw = {
    subreddit: (formData.get("subreddit") as string)
      ?.replace(/^r\//, "")
      .trim(),
    email: (formData.get("email") as string)?.trim(),
  };

  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { subreddit, email } = parsed.data;

  try {
    const content = process.env.OLLAMA_MODEL
      ? await generateWithOllama(subreddit)
      : await generateWithDeepAgent(subreddit);

    const html = wrapNewsletter(subreddit, content);

    await sendNewsletter(
      email,
      `r/${subreddit} this week — Hyperbulletin`,
      html,
    );

    return { success: true, message: "Newsletter sent! Check your inbox." };
  } catch (error) {
    console.error("Failed to generate sample:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
