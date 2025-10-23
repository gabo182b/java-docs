export interface JavaParameter {
  name: string;
  type: string;
  description?: string;
}

export interface JavaMethod {
  name: string;
  signature: string;
  description: string;
  parameters: JavaParameter[];
  returnType: string;
  modifiers: string[];
}

export interface JavaField {
  name: string;
  type: string;
  description: string;
  modifiers: string[];
}

export interface JavaDocumentation {
  className: string;
  packageName: string;
  description: string;
  methods: JavaMethod[];
  constructors: JavaMethod[];
  fields: JavaField[];
  examples: string[];
  officialUrl: string;
  scrapedAt: Date;
}

export interface SearchResult {
  documentation: JavaDocumentation;
  relevanceScore: number;
  matchedMethods: JavaMethod[];
  matchReason: string;
}
