"use server";

import { shouldCopyToClipboardFlow } from "@/ai/flows/clipboard-assistant";
import { z } from "zod";

export async function checkTextForAutoCopy(text: string): Promise<boolean> {
  try {
    // Validate input using the flow's schema before running
    shouldCopyToClipboardFlow.inputSchema.parse({ text });
  } catch (e) {
    // Zod validation failed, so we don't need to run the flow.
    return false;
  }
  
  try {
    const result = await shouldCopyToClipboardFlow({ text });
    return result;
  } catch (error) {
    console.error("Error running Genkit flow:", error);
    // In case of error, we don't want to auto-copy
    return false;
  }
}
