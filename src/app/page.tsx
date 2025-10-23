import { ChatInterface } from "@/components";

export default function Home() {
  return (
    <main className="h-screen">
      <ChatInterface />
    </main>
  );
}

export const metadata = {
  title: "Java Documentation Chatbot",
  description:
    "Ask questions about Java and get instant answers with code examples",
  keywords: [
    "Java",
    "Programming",
    "Documentation",
    "AI",
    "Learning",
    "Tutorial",
  ],
};
