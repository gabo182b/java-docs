'use client'

import { useChat } from 'ai/react'
import { MessageBubble } from './MessageBubble'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Send, Coffee, AlertCircle } from 'lucide-react';
import { useState } from 'react'


export function ChatInterface() {
  const [error, setError] = useState<string | null>(null)

  const {messages, input, handleInputChange, handleSubmit, isLoading} = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error);
      setError('Failed to send message. Please check your API key and try again.');
    },
  });

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Coffee className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Java Documentation Assistant</h1>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <aside className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <p className="flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              {error}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-red-700 hover:text-red-800"
            >
              Dismiss
            </Button>
          </div>
        </aside>
      )}

      {/* Chat */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Coffee className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white rounded-lg p-4 border shadow-sm flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-black ml-2">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="border-t bg-white/80 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 flex space-x-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about Java classes, methods, syntax, best practices..."
            className="flex-1 bg-white border-gray-300 focus:border-orange-400 focus:ring-orange-400"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </footer>
    </div>
  );
}