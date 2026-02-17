"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { generateSample } from "./actions";

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#FF4500"/>
      <path fill="#fff" d="M16.67 10a1.46 1.46 0 0 0-2.47-1 7.12 7.12 0 0 0-3.85-1.23l.65-3.08 2.13.45a1 1 0 1 0 1-.97 1 1 0 0 0-.96.68l-2.38-.5a.16.16 0 0 0-.19.12l-.73 3.44a7.14 7.14 0 0 0-3.89 1.23 1.46 1.46 0 1 0-1.61 2.39 2.87 2.87 0 0 0 0 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 0 0 0-.44 1.46 1.46 0 0 0 .64-1.17zM7.27 11a1 1 0 1 1 1 1 1 1 0 0 1-1.04-.97zm5.5 2.71a3.39 3.39 0 0 1-2.73.89 3.39 3.39 0 0 1-2.73-.89.16.16 0 0 1 .22-.22 3.08 3.08 0 0 0 2.51.72 3.08 3.08 0 0 0 2.51-.72.16.16 0 0 1 .22.22zm-.18-1.71a1 1 0 1 1 1-1 1 1 0 0 1-1.04.97z"/>
    </svg>
  );
}

export default function Page() {
  const [state, action, isPending] = useActionState(generateSample, null);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Hyperbulletin</h1>
          <h2 className="text-lg font-medium">
            AI-powered newsletters on any topic.
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Pick a topic, drop your email. Get a crisp AI digest of what matters: curated, summarized, delivered.
        </p>

        <form action={action} className="space-y-3">
          <InputGroup>
            <InputGroupAddon>
              <RedditIcon className="size-4 grayscale opacity-50" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              name="subreddit"
              placeholder="r/subreddit"
              required
              disabled={isPending}
            />
          </InputGroup>
          <div className="flex gap-2">
            <Input
              type="email"
              name="email"
              placeholder="you@email.com"
              required
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending} className="shrink-0">
              {isPending ? "Generating..." : "Get a sample"}
            </Button>
          </div>
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
