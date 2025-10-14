import { initializeSearch } from "@/lib/documentation"

async function testSearch() {
  console.log('Testing documentation search\n')

  const search = await initializeSearch()

  const testQueries = [
    'ArrayList',
    'How to HashMap',
    'String methods',
    'Iterate trough list'
  ]

  for (const query of testQueries) {
    console.log(`\n${'='.repeat(60)}`)
    console.log((`Query: '${query}'`))
    console.log('='.repeat(60))

    const results = search.search(query, 3)

    if (results.length === 0) {
      console.log('No results found\n')
      continue
    }

    for (const [index, result] of results.entries()) {
      const className = result.documentation.className
      const relevanceScore = result.relevanceScore
      const packageName = result.documentation.packageName
      const matchReason = result.matchReason
      const methods = result.documentation.methods
      const matchedMethods = result.matchedMethods

      console.log(`\n${index + 1}. ${className} (Score: ${relevanceScore})`)
      console.log(` Package: ${packageName}`)
      console.log(` Reason: ${matchReason}`)
      console.log(` Methods: ${methods.length}`)

      if (matchedMethods.length > 0) {
        console.log(` Matched Methods: `)
        matchedMethods.slice(0, 3).forEach(method => {
          console.log(` - ${method.name}`)
        })
      }
    }
  }
// Test output 
console.log(`\n${'='.repeat(60)}`)
console.log('AI context format test')
console.log('='.repeat(60))

const results = search.search('ArrayList methods', 2)
const aiContext = search.formatResultsForAi(results)
console.log('\n' + aiContext)

// Show all available classes
console.log(`\n${'='.repeat(60)}`)
console.log('Available classes')
console.log('='.repeat(60))
const allClasses = search.getAllClasses()
console.log(allClasses.join(', '))

console.log('\ Search test completed')
}

testSearch().catch(console.error)


