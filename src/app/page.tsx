"use client";

import { useState, useRef } from "react";
import { Bot, Copy, Check, FileDown, FileUp, Plus } from "lucide-react";
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
  const [texts, setTexts] = useState<string[]>(["", "", ""]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (index: number, newText: string) => {
    const newTexts = [...texts];
    newTexts[index] = newText;
    setTexts(newTexts);
  };

  const handleAddPrompt = () => {
    setTexts(prev => [...prev, ""]);
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

        if (!data.clipquickPads || !Array.isArray(data.clipquickPads) || !data.clipquickPads.every((item: any) => typeof item === 'string')) {
          throw new Error("Invalid or corrupted project file. Expected 'clipquickPads' to be an array of strings.");
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
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
            <h1 className="text-xl font-bold tracking-tight">
                ClipQuick
            </h1>
            <div className="flex items-center space-x-4">
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger>
                        <div className="flex items-center gap-2 rounded-full border bg-card/50 px-3 py-1.5 text-sm text-muted-foreground">
                        <Bot className="h-5 w-5 text-accent" />
                        <span className="hidden sm:inline">AI Active</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>We'll automatically copy sensitive text for you!</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button onClick={handleSaveProject} variant="outline">
                    <FileDown className="mr-0 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Save</span>
                </Button>
                <Button onClick={triggerFileUpload} variant="outline">
                    <FileUp className="mr-0 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Load</span>
                </Button>
            </div>
        </header>
        <main className="container mx-auto grid flex-1 grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[280px_1fr]">
            {/* Left Column: Prompts List */}
            <aside className="hidden md:flex flex-col gap-4 sticky top-20 h-fit">
                <h2 className="text-lg font-semibold tracking-tight">Quick Copy Prompts</h2>
                <div className="flex flex-col gap-2">
                    {texts.map((text, i) => (
                    <Button
                        key={i}
                        onClick={() => handleManualCopy(i)}
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
            </aside>

            {/* Right Column: Clipboard Cards */}
            <div className="flex flex-col gap-6">
                 {texts.map((text, i) => (
                    <ClipboardCard
                        key={i}
                        padNumber={i + 1}
                        text={text}
                        onTextChange={(newText) => handleTextChange(i, newText)}
                    />
                    ))}
                <Button onClick={handleAddPrompt} variant="outline" className="w-full mt-2">
                    <Plus className="mr-2 h-5 w-5" /> Add New Pad
                </Button>
            </div>
        </main>
      </div>
    </>
  );
}
