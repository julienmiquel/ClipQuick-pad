"use client";

import { useState, useRef } from "react";
import { Bot, Copy, Check, FileDown, FileUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardCard } from "@/components/clipboard-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [texts, setTexts] = useState<string[]>(Array(6).fill(""));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (index: number, newText: string) => {
    const newTexts = [...texts];
    newTexts[index] = newText;
    setTexts(newTexts);
  };

  const handleManualCopy = (index: number) => {
    const textToCopy = texts[index];
    if (!textToCopy || copiedIndex === index) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "✅ Success",
        description: `Text from Pad #${index + 1} has been copied to your clipboard.`,
      });
    }).catch(err => {
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Could not copy text to clipboard.",
      });
    });
  };

  const handleSaveProject = () => {
    const projectData = {
      version: 1,
      clipquickPads: texts,
    };
    const jsonString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clipquick-project.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "✅ Project Saved",
      description: "Your project has been saved to your downloads folder.",
    });
  };

  const handleLoadProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== "string") {
          throw new Error("File content is not readable.");
        }
        const data = JSON.parse(content);

        if (!data.clipquickPads || !Array.isArray(data.clipquickPads) || data.clipquickPads.length !== 6 || !data.clipquickPads.every((item: any) => typeof item === 'string')) {
          throw new Error("Invalid or corrupted project file.");
        }
        
        setTexts(data.clipquickPads);
        toast({
          title: "✅ Project Loaded",
          description: "Your project data has been loaded successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "❌ Load Error",
          description: error instanceof Error ? error.message : "Could not load the project file.",
        });
      }
    };
    reader.onerror = () => {
      toast({
          variant: "destructive",
          title: "❌ File Read Error",
          description: "Could not read the selected file.",
        });
    }
    reader.readAsText(file);
    event.target.value = ""; 
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,application/json"
        className="hidden"
        onChange={handleLoadProject}
      />
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

        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-headline tracking-tight lg:text-5xl">
              ClipQuick Dashboard
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Your smart clipboards, ready for action. Just type and we'll handle the copying for you.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-start gap-6 mb-8 w-full max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
              <Button onClick={handleSaveProject}>
                <FileDown className="mr-2 h-5 w-5" /> Save Project
              </Button>
              <Button onClick={triggerFileUpload} variant="outline">
                <FileUp className="mr-2 h-5 w-5" /> Load Project
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              {[...Array(6)].map((_, i) => (
                <Button
                  key={i}
                  onClick={() => handleManualCopy(i)}
                  disabled={!texts[i] || copiedIndex === i}
                  className="transition-all duration-300"
                >
                  {copiedIndex === i ? (
                    <>
                      <Check className="mr-2 h-5 w-5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-5 w-5" /> Prompt {i + 1}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex w-full max-w-lg mx-auto flex-col gap-6">
            {[...Array(6)].map((_, i) => (
              <ClipboardCard
                key={i}
                padNumber={i + 1}
                text={texts[i]}
                onTextChange={(newText) => handleTextChange(i, newText)}
              />
            ))}
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>A smart clipboard built with Next.js and Genkit.</p>
        </footer>
      </main>
    </>
  );
}
