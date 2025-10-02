'use client'

import { useState } from "react";
import { CodeBlockProps } from "./types";
import { Button } from "./ui/Button";
import { Check, Code, Copy } from "lucide-react";

export function CodeBlock({code, language = 'java'}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) 
    } catch (error) {
      console.error('Failed to copy code: ', error)
    }
  }

  return (
    <figure className="relative bg-gray-900 rounded-lg overflow-hidden my-4 border border-gray-700 w-full max-w-full">
      <header className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <figcaption className="flex items-center space-x-2">
          <Code className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300 font-medium">
            {language.toUpperCase()}
          </span>
        </figcaption>

        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="text-gray-300 hover:text-white hover:bg-gray-700 h-7 px-2"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </header>

      <pre className="p-4 text-sm leading-relaxed overflow-x-auto">
        <code className="text-gray-100 font-mono">
          {code}
        </code>
      </pre>
    </figure>
  );
}