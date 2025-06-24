"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";
import { checkTextForAutoCopy } from "@/app/actions";

interface ClipboardCardProps {
  padNumber: number;
}

export function ClipboardCard({ padNumber }: ClipboardCardProps) {
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
    <Card className="w-full shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-headline tracking-tight">
          ClipQuick Pad #{padNumber}
        </CardTitle>
        <CardDescription className="pt-1 text-sm">
          Your text, ready to paste.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type here..."
          className="min-h-[120px] resize-y text-base ring-offset-background focus-visible:ring-2 focus-visible:ring-accent"
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
  );
}
