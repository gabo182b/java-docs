import { User, Coffee } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { extractCodeBlocks } from '@/lib/utils';
import { MessageBubbleProps } from './types';

export function MessageBubble({message}: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const blocks = extractCodeBlocks(message.content)

  return (
    <article className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-4xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <figure className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-orange-500 text-white'
          }`} role="img" aria-label={isUser ? 'User avatar' : 'Assistant avatar'}>
            {isUser ? (
              <User className="h-4 w-4" />
            ) : (
              <Coffee className="h-4 w-4" />
            )}
          </div>
        </figure>
        {/* Message */}
        <section className={`rounded-lg p-4 ${
          isUser
            ? 'bg-blue-500 text-white max-w-md shadow-md'
            : 'bg-white border border-gray-200 shadow-sm flex-1'
        }`}>
          {blocks.length > 0 ? (
            <>
              {blocks.map((block, index) => (
                block.type === 'code' ? (
                  <CodeBlock
                    key={index}
                    code={block.content}
                    language={block.language}
                  />
                ) : (
                  <p key={index} className={`whitespace-pre-wrap leading-relaxed ${
                    isUser ? 'text-white' : 'text-gray-800'
                  } ${index > 0 ? 'mt-3' : ''}`}>
                    {block.content}
                  </p>
                )
              ))}
            </>
          ) : (
            <p className={`whitespace-pre-wrap leading-relaxed ${
              isUser ? 'text-white' : 'text-gray-800'
            }`}>
              {message.content}
            </p>
          )}
        </section>
      </div>
    </article>
  )
}