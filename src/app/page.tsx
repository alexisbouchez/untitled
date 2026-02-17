"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSample } from "./actions";

export default function Page() {
  const [state, action, isPending] = useActionState(generateSample, null);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Hyperbulletin</h1>
          <h2 className="text-lg text-muted-foreground">
            Reddit, digested. Delivered.
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Pick a subreddit. Get a weekly newsletter with the best posts,
          discussions, and links. No noise. No algorithm. Just the good stuff.
        </p>

        <form action={action} className="space-y-3">
          <Input
            type="text"
            name="subreddit"
            placeholder="r/subreddit"
            required
            disabled={isPending}
          />
          <Input
            type="email"
            name="email"
            placeholder="you@email.com"
            required
            disabled={isPending}
          />
          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "Generating..." : "Get sample"}
          </Button>
        </form>

        {state && (
          <p
            className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}
          >
            {state.message}
          </p>
        )}
      </div>
    </main>
  );
}
