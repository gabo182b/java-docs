import { JavaDocumentation, JavaMethod, SearchResult } from "./types"

export class DocumentationSearch {
  private docs: JavaDocumentation[] = []

  loadDocumentation(docs: JavaDocumentation[]) {
    this.docs = docs
  }

  search(query: string, maxResults: number = 3): SearchResult[] {
    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    const keywords = this.extractKeywords(lowerQuery)

    for (const doc of this.docs) {
      const result = this.scoreDocument(doc, keywords, lowerQuery)

      if (result.relevanceScore > 0) {
        results.push(result)
      }
    }

    results.sort((a, b) => b.relevanceScore - a.relevanceScore)

    return results.slice(0, maxResults)
  }

  private extractKeywords(query: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'what', 'how', 'why', 'when',
      'where', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
      'my', 'your', 'his', 'its', 'our', 'their', 'java', 'use', 'using', 'example',
    ])

    const words = query.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 2).filter(word => !stopWords.has(word))

    return [...new Set(words)]
  }

  private scoreDocument(doc: JavaDocumentation, keywords: string[], fullQuery: string): SearchResult {
    let score = 0
    let matchReason = ''
    const matchedMethods: JavaMethod[] = []

    const className = doc.className.toLowerCase()
    const description = doc.description.toLowerCase()
    const packageName = doc.packageName.toLowerCase()

    // Score className
    if (keywords.some(keyword => className === keyword)) {
      score += 100
      matchReason = `Exact match: ${doc.className}`
    }

    for (const keyword of keywords) {
      if (className.includes(keyword)) {
        score += 50
        matchReason = matchReason || `Class name contains: ${keyword}`
      }
    }

    // Score description
    for (const keyword of keywords) {
      if (description.includes(keyword)) {
        score += 10
        matchReason = matchReason || `Description mentions: ${keyword}`
      }
    }

    // Score packageName
    for (const keyword of keywords) {
      if (packageName.includes(keyword)) {
        score += 5
      }
    }

    // Score method
    for (const method of doc.methods) {
      const methodName = method.name.toLowerCase()

      for (const keyword of keywords) {
        if (methodName.includes(keyword)) {
          score += 20
          matchedMethods.push(method)
          matchReason = matchReason || `Method: ${method.name}`
        }
      }
    }

    for (const method of doc.methods) {
      const methodDescription = method.description.toLowerCase()
      if (fullQuery.length > 0 && methodDescription.includes(fullQuery)) {
        score += 15
        if (!matchedMethods.includes(method)) {
          matchedMethods.push(method)
        }
      }
    }

    return {
      documentation: doc,
      relevanceScore: score,
      matchedMethods: matchedMethods.slice(0, 5),
      matchReason: matchReason || 'General match'
    }
  }

  // Helpers functions
  findClass(className: string): JavaDocumentation | null {
    const lowerName = className.toLowerCase()

    return this.docs.find(doc => doc.className.toLowerCase() === lowerName) || null
  }

  getAllClasses(): string[] {
    return this.docs.map(doc => doc.className).sort()
  }

  formatResultsForAi(results: SearchResult[]): string {
    if (results.length === 0) {
      return 'No relevant documentation found in local cache.'
    }

    let context = 'Relevant Java Documentation:\n\n'

    for (const [index, result] of results.entries()) {
      const doc = result.documentation

      context += `${index + 1}. ${doc.className} (${doc.packageName})\n`
      context += `  ${doc.description.slice(0, 200)}...\n`

      if (result.matchedMethods.length > 0) {
        context += ` Relevant Methods: \n`
        for (const method of result.matchedMethods.slice(0, 3)) {
          context += `  - ${method.name}(): ${method.description.slice(0, 100)}`
        }
      }

      context += ` Official docs: ${doc.officialUrl}\n\n`
    }

    return context
  }
}

// Singleton pattern
let searchInstance: DocumentationSearch | null = null

export function getDocumentationSearch(): DocumentationSearch {
  if (!searchInstance) {
    searchInstance = new DocumentationSearch()
  }

  return searchInstance
}

export async function initializeSearch(docsPath?: string): Promise<DocumentationSearch> {
  const search = getDocumentationSearch()

  try {
    if (typeof window === 'undefined') {
      const fs = await import('fs/promises')
      const path = await import('path')

      const filePath = docsPath || path.join(process.cwd(), 'data', 'java-docs.json')
      const data = await fs.readFile(filePath, 'utf-8')
      const docs = JSON.parse(data) as JavaDocumentation[]

      search.loadDocumentation(docs)
      console.log(`Initialized search with ${docs.length} classes`)
    }
  } catch (error) {
    console.error('Failed to initialize search:', error)
  }

  return search
}