import { JavaDocsScraper, COMMON_JAVA_CLASSES } from "@/lib/documentation" 
import { writeFile, stat } from 'fs/promises' 
import { join } from 'path' 

async function main() {
  const scraper = new JavaDocsScraper()

  console.log(`Scraping ${COMMON_JAVA_CLASSES.length} classes.`)

  const documentation = await scraper.scrapeMultipleClasses(COMMON_JAVA_CLASSES)

  const dataDir = join(process.cwd(), 'data')

  const filePath = join(dataDir, 'java-docs.json')

  await writeFile(
    filePath,
    JSON.stringify(documentation, null, 2),
    'utf-8'
  ) 
    
  const fileStats = await stat(filePath) 

  console.log(`File size: ${fileStats.size} bytes`) 
  
    documentation.forEach(doc => {
    console.log(`  - ${doc.className}: ${doc.methods.length} methods, ${doc.constructors.length} constructors`) 
  }) 
  }

main().catch(error => {
  console.error('Error:', error) 
  process.exit(1) 
})
