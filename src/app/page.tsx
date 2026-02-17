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
              <span className="text-muted-foreground text-sm">r/</span>
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              name="subreddit"
              placeholder="subreddit"
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
