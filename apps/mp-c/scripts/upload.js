import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ci from 'miniprogram-ci'
import packageJson from '../package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const APP_ID = process.env.APP_ID || 'wxa32e349ec0144dd5'
// The build output directory for production
const projectPath = path.resolve(__dirname, '../dist/build/mp-weixin')
const privateKeyPath = path.resolve(__dirname, `../private.${APP_ID}.key`)

const version = packageJson.version || '1.0.0'
// Use commit message or default description
const desc = process.env.CI_COMMIT_MESSAGE || `CI Upload at ${new Date().toLocaleString()}`

  ; (async () => {
  console.log(`Starting upload for ${APP_ID}...`)
  console.log(`Project Path: ${projectPath}`)
  console.log(`Version: ${version}`)

  // 1. Check Project Path (Build output)
  if (!fs.existsSync(projectPath)) {
    console.error(`Error: Project path does not exist: ${projectPath}`)
    console.error('Please build the project first (e.g., bun run build:mp-weixin)')
    process.exit(1)
  }

  // 2. Prepare Private Key
  // If file doesn't exist, try to create it from env var (useful for CI)
  if (!fs.existsSync(privateKeyPath)) {
    if (process.env.MP_PRIVATE_KEY) {
      console.log('Writing private key from environment variable...')
      fs.writeFileSync(privateKeyPath, process.env.MP_PRIVATE_KEY)
    }
    else {
      console.error(`Error: Private key not found at ${privateKeyPath} and MP_PRIVATE_KEY env var not set.`)
      process.exit(1)
    }
  }

  // 3. Initialize Project
  const project = new ci.Project({
    appid: APP_ID,
    type: 'miniProgram',
    projectPath,
    privateKeyPath,
    ignores: ['node_modules/**/*'],
  })

  // 4. Upload
  try {
    const uploadResult = await ci.upload({
      project,
      version,
      desc,
      setting: {
        es6: true,
        minify: true,
      },
      onProgressUpdate: console.log,
    })
    console.log('Upload success:', uploadResult)
  }
  catch (error) {
    console.error('Upload failed:', error)
    process.exit(1)
  }
})()
