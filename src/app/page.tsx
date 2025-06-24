"use client";

import { Bot } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardCard } from "@/components/clipboard-card";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8">
      <div className="absolute top-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 rounded-full border bg-card/50 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
                <Bot className="h-5 w-5 text-accent" />
                <span>AI Assistant Active</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>We'll automatically copy text for you!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline tracking-tight lg:text-5xl">
            ClipQuick Dashboard
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your smart clipboards, ready for action. Just type and we'll handle the copying for you.
          </p>
        </div>

        <div className="flex w-full max-w-lg mx-auto flex-col gap-6">
          {[...Array(6)].map((_, i) => (
            <ClipboardCard key={i} padNumber={i + 1} />
          ))}
        </div>
      </div>

       <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>A smart clipboard built with Next.js and Genkit.</p>
      </footer>
    </main>
  );
}
