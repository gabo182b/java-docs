import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ContentBlock } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractCodeBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  const parts = content.split(/(```[\s\S]*?```)/)

  parts.forEach((part) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const codeContent = part.slice(3, -3)
      const lines = codeContent.split('\n')
      const language = lines[0].trim() || 'java'
      const code = lines.slice(1).join('\n')

      blocks.push({
        type: 'code',
        
        content: code,
        language: language
      })
    } else if (part.trim()) {
      blocks.push({
        type: 'text',
        content: part
      })
    }
  })

  return blocks
  }

export const javaConvertationStarters = [
  "What is the difference between ArrayList and LinkedList?",
  "How do I use HashMap in Java?",
  "Explain Java inheritance with an example",
  "What are lambda expressions in Java?",
  "How to handle exceptions in Java?",
  "What is the difference between abstract classes and interfaces?",
  "How do I read a file in Java?",
  "Explain Java collections framework"
]