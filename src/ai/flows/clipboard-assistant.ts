'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This flow uses a set of heuristics to determine if text should be auto-copied.
// In a real-world scenario, this could be a more sophisticated check using an LLM.

export const shouldCopyToClipboardFlow = ai.defineFlow(
  {
    name: 'shouldCopyToClipboardFlow',
    inputSchema: z.object({ text: z.string().min(10) }),
    outputSchema: z.boolean(),
  },
  async ({ text }) => {
    const trimmedText = text.trim();

    // Heuristic 1: Check for common keywords indicating sensitive/important info
    const keywords = ['password:', 'key:', 'token:', 'ssh-', '-----BEGIN'];
    if (keywords.some(keyword => trimmedText.includes(keyword))) {
      return true;
    }

    // Heuristic 2: Check for it's a URL
    try {
      const url = new URL(trimmedText);
      // Check for common protocols
      if (['http:', 'https:'].includes(url.protocol)) {
        return true;
      }
    } catch (_) {
      // Not a valid URL, continue
    }
    
    // Heuristic 3: Check for code-like structures (simple check)
    // e.g., contains curly braces and semicolons, or looks like a command
    const codeLikely = 
        (trimmedText.includes('{') && trimmedText.includes('}')) ||
        (trimmedText.includes('(') && trimmedText.includes(')')) ||
        trimmedText.startsWith('git ') ||
        trimmedText.startsWith('npm ') ||
        trimmedText.startsWith('yarn ');
        
    if (codeLikely && trimmedText.length > 20) {
        return true;
    }

    return false;
  }
);
