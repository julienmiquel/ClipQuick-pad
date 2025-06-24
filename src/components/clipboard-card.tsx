"use client";

import { useEffect, useRef, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { checkTextForAutoCopy } from "@/app/actions";

interface ClipboardCardProps {
  padNumber: number;
  text: string;
  onTextChange: (newText: string) => void;
}

export function ClipboardCard({ padNumber, text, onTextChange }: ClipboardCardProps) {
  const [isAiChecking, startTransition] = useTransition();
  const { toast } = useToast();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAutoCopyToClipboard = () => {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "🤖 AI Assistant",
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
            handleAutoCopyToClipboard();
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
      <CardHeader>
        <div>
          <CardTitle className="text-xl font-headline tracking-tight">
            ClipQuick Pad #{padNumber}
          </CardTitle>
          <CardDescription className="pt-1 text-sm">
            Your text, ready to paste.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste or type here..."
          className="min-h-[120px] resize-y text-base ring-offset-background focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Text to copy"
        />
      </CardContent>
    </Card>
  );
}
