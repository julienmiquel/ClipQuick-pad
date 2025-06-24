"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Bot } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { checkTextForAutoCopy } from "./actions";

export default function Home() {
  const [text, setText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isAiChecking, startTransition] = useTransition();
  const { toast } = useToast();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyToClipboard = (isAuto: boolean = false) => {
    if (!text || (isCopied && !isAuto)) return;

    navigator.clipboard.writeText(text).then(() => {
      if (!isAuto) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
      toast({
        title: isAuto ? "🤖 AI Assistant" : "✅ Success",
        description: "Text has been copied to your clipboard.",
      });
    }).catch(err => {
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Could not copy text to clipboard.",
      });
    });
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    if (text.trim().length > 10) { 
      debounceTimeoutRef.current = setTimeout(() => {
        startTransition(async () => {
          const shouldCopy = await checkTextForAutoCopy(text);
          if (shouldCopy) {
            handleCopyToClipboard(true);
          }
        });
      }, 1500);
    }
    
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [text]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
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

      <Card className="w-full max-w-2xl shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline tracking-tight lg:text-4xl">
            ClipQuick
          </CardTitle>
          <CardDescription className="pt-2">
            Your text, ready to paste. Just type and we'll handle the copying.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type here... code, links, keys, and more."
            className="min-h-[250px] resize-y text-base ring-offset-background focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Text to copy"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => handleCopyToClipboard(false)}
            disabled={!text || isCopied}
            className="w-full transition-all duration-300"
            size="lg"
          >
            {isCopied ? (
              <>
                <Check className="mr-2 h-5 w-5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" /> Manual Copy
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>A smart clipboard built with Next.js and Genkit.</p>
      </footer>
    </main>
  );
}
