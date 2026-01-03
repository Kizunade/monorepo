import fs from 'node:fs'
import path from 'node:path'
import { Suspense } from 'react'
import { MockDashboard } from '@/components/mock-dashboard'

async function getMockModules() {
  const mockDir = path.join(process.cwd(), 'src/app/api/mock')
  try {
    const entries = await fs.promises.readdir(mockDir, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()
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
