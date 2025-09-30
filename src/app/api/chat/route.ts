import { streamText } from 'ai';
import { aiModel, javaSystemPrompt } from '@/lib/ai';

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const lastMessage = messages[messages.length - 1]
    console.log('🔍 User asked:', lastMessage?.content?.slice(0, 100) + '...');

    const result = streamText({
      model: aiModel,
      system: javaSystemPrompt,
      messages,
      // maxTokens: 1000,
      temperature: 0.7,
    })

   return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process your question',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Please try again',
        suggestion: 'Make sure your OpenAI API key is properly configured in .env.local'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
}}

export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: 'OK', 
      message: 'Java Docs Chat API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
