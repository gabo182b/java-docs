import { JSX } from "react";

export function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-orange-600">$1</code>',
    );
}

export function parseMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-lg font-bold mt-3 mb-1 text-gray-900">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold mt-4 mb-1 text-gray-900">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold mt-4 mb-1 text-gray-900">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.match(/^\d+\.\s/)) {
      const items = [line];
      while (i + 1 < lines.length && lines[i + 1].match(/^\d+\.\s/)) {
        items.push(lines[++i]);
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside my-1 space-y-0.5">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="text-gray-800 leading-snug"
              dangerouslySetInnerHTML={{
                __html: formatInlineMarkdown(item.replace(/^\d+\.\s/, "")),
              }}
            />
          ))}
        </ol>,
      );
    } else if (line.match(/^[\*\-]\s/)) {
      const items = [line];
      while (i + 1 < lines.length && lines[i + 1].match(/^[\*\-]\s/)) {
        items.push(lines[++i]);
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside my-1 space-y-0.5">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="text-gray-800 leading-snug"
              dangerouslySetInnerHTML={{
                __html: formatInlineMarkdown(item.replace(/^[\*\-]\s/, "")),
              }}
            />
          ))}
        </ul>,
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
    } else {
      elements.push(
        <p
          key={key++}
          className="text-gray-800 leading-snug"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
        />,
      );
    }
  }

  return elements;
}
