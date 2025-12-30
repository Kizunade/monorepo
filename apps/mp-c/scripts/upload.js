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
const qrcodePath = path.resolve(__dirname, '../preview.jpg')

// Helper to send webhook
async function sendWebhook(status, errorMessage = '') {
  const baseUrl = 'https://pet.koiism.cn'
  const webhookUrl = `${baseUrl}/api/lark/bot-ci-cd/on-mp-uploaded`

  console.log(`Sending webhook to ${webhookUrl}...`)

  try {
    const formData = new FormData()
    formData.append('status', status)
    formData.append('commit-message', desc)
    formData.append('mission', '小程序构建发布')

    if (errorMessage) {
      formData.append('error-message', errorMessage)
    }

    if (status === 'success' && fs.existsSync(qrcodePath)) {
      const fileBuffer = fs.readFileSync(qrcodePath)
      const blob = new Blob([fileBuffer])
      formData.append('qrcode', blob, 'preview.jpg')
    }

    if (process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID) {
      const logUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      formData.append('log-url', logUrl)
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    console.log('Webhook response:', result)
  }
  catch (error) {
    console.error('Failed to send webhook:', error)
  }
}

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

    await sendWebhook('success')
  }
  catch (error) {
    console.error('Upload failed:', error)
    await sendWebhook('failed', error.message || String(error))
    process.exit(1)
  }
})()
