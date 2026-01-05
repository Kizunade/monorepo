import fs from 'node:fs'
import path from 'node:path'
import { Suspense } from 'react'
import { MockDashboard } from '@/components/mock-dashboard'

async function getMockModules() {
  const mockDir = path.join(process.cwd(), 'src/app/api/mock')
  const modules: string[] = []

  try {
    const entries = await fs.promises.readdir(mockDir, { withFileTypes: true })
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      
      const entryPath = path.join(mockDir, entry.name)
      const entryContents = await fs.promises.readdir(entryPath)
      
      // Direct module (legacy or flat structure)
      if (entryContents.includes('model.ts')) {
        modules.push(entry.name)
        continue
      }
      
      // Category folder (e.g. owner, sitter)
      // Look for subdirectories that contain model.ts
      const subEntries = await fs.promises.readdir(entryPath, { withFileTypes: true })
      
      for (const subEntry of subEntries) {
        if (!subEntry.isDirectory()) continue
        if (subEntry.name.startsWith('[')) continue // Skip dynamic routes folder
        
        const subEntryPath = path.join(entryPath, subEntry.name)
        try {
          const subEntryContents = await fs.promises.readdir(subEntryPath)
          if (subEntryContents.includes('model.ts')) {
            modules.push(`${entry.name}/${subEntry.name}`)
          }
        } catch (e) {
          // Ignore if cannot read subdirectory
        }
      }
    }
    
    return modules.sort()
  }
  catch (error) {
    console.error('Error reading mock directory:', error)
    return []
  }
}

export default async function MockDocsPage() {
  const modules = await getMockModules()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MockDashboard modules={modules} />
    </Suspense>
  )
}
