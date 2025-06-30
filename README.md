# ClipQuick

ClipQuick is your ultimate clipboard companion, designed to streamline your workflow with intelligent features and an ergonomic interface.

## Features

- **Multiple Clipboard Pads**: Manage multiple text snippets simultaneously in separate pads.
- **Dynamic Pads**: Add new pads as needed to expand your clipboard.
- **Save & Load Projects**: Persist your clipboard sessions by saving them to a JSON file and loading them back anytime.
- **AI-Powered Auto-Copy**: Automatically copies text that appears to be sensitive or important, like passwords, API keys, or URLs.
- **Quick Copy Sidebar**: A convenient sidebar lists all your prompts, allowing for quick copying with a single click. The sidebar is responsive and moves to the top on smaller screens for easy access.
- **Ergonomic Design**: A clean, modern, and intuitive interface built with Next.js, ShadCN UI, and Tailwind CSS.

## Getting Started

The main application logic is in `src/app/page.tsx`. This file contains the main component that renders the clipboard pads and handles user interactions.

The AI functionality is powered by Genkit and the relevant flow can be found in `src/ai/flows/clipboard-assistant.ts`.
