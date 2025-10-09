import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
import { JavaDocumentation, JavaMethod, JavaField } from './types'

export class JavaDocsScraper {
  private baseUrl = 'https://docs.oracle.com/en/java/javase/17/docs/api'
  
  async scrapeClass(packageName: string, className: string): Promise<JavaDocumentation | null> {
    try {
      const packagePath = packageName.replace(/\./g, '/')
      const url = `${this.baseUrl}/java.base/${packagePath}/${className}.html`
            
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible JavaDocsBot/1.0)',
        },
        signal: AbortSignal.timeout(10000),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const html = await response.text()
      
      const $ = cheerio.load(html)
      
      const description = this.extractDescription($)
      
      const methods = this.extractMethods($)
      
      const constructors = this.extractConstructors($)
      
      const fields = this.extractFields($)
      
      const examples = this.extractExamples($)
            
      return {
        className,
        packageName,
        description,
        methods,
        constructors,
        fields,
        examples,
        officialUrl: url,
        scrapedAt: new Date(),
      }
    } catch (error) {
      console.error(`Error scraping ${className}:`, error)
      return null
    }
  }
  
  private extractDescription($: cheerio.CheerioAPI): string {
    let description = ''
    
    const selectors = [
      'section.class-description div.block',
      'div.type-signature + div.block',
      'div.block',
      '.description .block',
      'section.description div',
    ]
    
    for (const selector of selectors) {
      description = $(selector).first().text().trim()
      if (description && description.length > 20) break
    }
    
    return description || 'No description available'
  }
  
  private extractMethods($: cheerio.CheerioAPI): JavaMethod[] {
    const methods: JavaMethod[] = []

    const methodSection = $('section.method-summary, #method-summary')

    if (methodSection.length > 0) {
      const summaryTable = methodSection.find('.summary-table, .three-column-summary')

      if (summaryTable.length > 0) {
        this.extractMethodsFromTable($, summaryTable, methods)
      }
    }
    return methods
  }
  
  private extractMethodsFromTable($: cheerio.CheerioAPI, $container: cheerio.Cheerio<Element>, methods: JavaMethod[]) {
    const methodRows = $container.find('.col-second').not('.table-header')

    methodRows.each((_, element) => {
      const $methodCell = $(element)

      const $returnTypeCell = $methodCell.prev('.col-first')

      const $descCell = $methodCell.next('.col-last')

      const returnType = $returnTypeCell.find('code').text().trim() || $returnTypeCell.text().trim()

      const methodLink = $methodCell.find('a.member-name-link').first()
      const fullSignature = $methodCell.find('code').text().trim() || $methodCell.text().trim()
      let methodName = methodLink.text().trim()

      if (!methodName) return

      methodName = methodName.split('(')[0].trim()

      const description = $descCell.find('.block').text().trim() || $descCell.text().trim()

      methods.push({
        name: methodName,
        signature: fullSignature || `${returnType} ${methodName}()`,
        description: description.slice(0, 300),
        parameters: [],
        returnType,
        modifiers: [],
      })
    })
  }
  
  private extractConstructors($: cheerio.CheerioAPI): JavaMethod[] {
    const constructors: JavaMethod[] = []

    const constructorSection = $('section.constructor-summary, #constructor-summary')

    if (constructorSection.length > 0) {
      const summaryTable = constructorSection.find('.summary-table, .two-column-summary')

      if (summaryTable.length > 0) {
        this.extractConstructorsFromTable($, summaryTable, constructors)
      }
    }

    return constructors
  }
  
  private extractConstructorsFromTable($: cheerio.CheerioAPI, $container: cheerio.Cheerio<Element>, constructors: JavaMethod[]) {

    const constructorRows = $container.find('.col-constructor-name').not('.table-header')

    constructorRows.each((_, element) => {
      const $signatureCell = $(element)

      const $descCell = $signatureCell.next('.col-last')

      const constructorLink = $signatureCell.find('a.member-name-link').first()
      const fullSignature = $signatureCell.find('code').text().trim() || $signatureCell.text().trim()
      let name = constructorLink.text().trim()

      if (!name) return

      name = name.split('(')[0].trim()

      const description = $descCell.find('.block').text().trim() || $descCell.text().trim()

      constructors.push({
        name,
        signature: fullSignature || `${name}()`,
        description: description.slice(0, 300),
        parameters: [],
        returnType: '',
        modifiers: ['public'],
      })
    })
  }
  
  private extractFields($: cheerio.CheerioAPI): JavaField[] {
    const fields: JavaField[] = []

    const fieldSection = $('section.field-summary, #field-summary')

    if (fieldSection.length > 0) {
      const summaryTable = fieldSection.find('.summary-table, .three-column-summary')

      if (summaryTable.length > 0) {
        this.extractFieldsFromTable($, summaryTable, fields)
      }
    }

    return fields
  }
  
  private extractFieldsFromTable($: cheerio.CheerioAPI, $container: cheerio.Cheerio<Element>, fields: JavaField[]) {

    const fieldRows = $container.find('.col-second').not('.table-header')

    fieldRows.each((_, elem) => {
      const $nameCell = $(elem)

      const $typeCell = $nameCell.prev('.col-first')

      const $descCell = $nameCell.next('.col-last')

      const type = $typeCell.find('code').text().trim() || $typeCell.text().trim()

      const fieldLink = $nameCell.find('a.member-name-link').first()
      const name = fieldLink.text().trim() || $nameCell.find('code').text().trim() || $nameCell.text().trim()

      if (!name) return

      const description = $descCell.find('.block').text().trim() || $descCell.text().trim()

      fields.push({
        name,
        type,
        description: description.slice(0, 300),
        modifiers: this.extractModifiers(type),
      })
    })
  }
  
  private extractExamples($: cheerio.CheerioAPI): string[] {
    const examples: string[] = []

    $('pre, code.language-java').each((_, element) => {
      const code = $(element).text().trim()

      if (code.length > 20 && (
        code.includes('class') ||
        code.includes('public') ||
        code.includes('import') ||
        code.includes('new ')
      )) {
        examples.push(code)
      }
    })

    // Limit to 5 examples
    return examples.slice(0, 5)
  }

  private extractModifiers(signature: string): string[] {
    const modifiers: string[] = []
    const keywords = ['public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized']
    
    const lowerSig = signature.toLowerCase()
    keywords.forEach(keyword => {
      if (lowerSig.includes(keyword)) {
        modifiers.push(keyword)
      }
    })
    
    return modifiers
  }
  
  async scrapeMultipleClasses(classes: Array<{ package: string, name: string }>): Promise<JavaDocumentation[]> {
    const results: JavaDocumentation[] = []
    
    for (const classInfo of classes) {
      const doc = await this.scrapeClass(classInfo.package, classInfo.name)
      
      if (doc) {
        results.push(doc)
      }
      
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    return results
  }
}

export const COMMON_JAVA_CLASSES = [
  { package: 'java.util', name: 'ArrayList' },
  { package: 'java.util', name: 'HashMap' },
  { package: 'java.util', name: 'HashSet' },
  { package: 'java.util', name: 'LinkedList' },
  { package: 'java.lang', name: 'String' },
  { package: 'java.lang', name: 'Integer' },
  { package: 'java.lang', name: 'Object' },
  { package: 'java.io', name: 'File' },
  { package: 'java.io', name: 'FileReader' },
  { package: 'java.io', name: 'BufferedReader' },
]