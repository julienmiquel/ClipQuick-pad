"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface QuickPromptsProps {
  texts: string[];
  copiedIndex: number | null;
  onManualCopy: (index: number) => void;
}

export function QuickPrompts({ texts, copiedIndex, onManualCopy }: QuickPromptsProps) {
  return (
    <>
      <h2 className="text-lg font-semibold tracking-tight">Quick Copy Prompts</h2>
      <div className="flex flex-col gap-2">
        {texts.map((text, i) => (
          <Button
            key={i}
            onClick={() => onManualCopy(i)}
            disabled={!text || copiedIndex === i}
            variant={copiedIndex === i ? 'secondary' : 'ghost'}
            className="transition-all duration-300 w-full justify-start text-left"
          >
            {copiedIndex === i ? (
              <Check className="mr-2 h-5 w-5 text-primary" />
            ) : (
              <Copy className="mr-2 h-5 w-5" />
            )}
            <span className="truncate">
              {text ? text : `Prompt ${i + 1}`}
            </span>
          </Button>
        ))}
      </div>
    </>
  );
}
