export type ContentBlock = {
  type: "text" | "code";
  content: string;
  language?: string;
};
