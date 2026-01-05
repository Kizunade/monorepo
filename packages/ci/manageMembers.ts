import ci from 'miniprogram-mp-ci'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { membersWechat } from './memberManage/membersWechat'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const KEYS_DIR = path.resolve(__dirname, 'memberManage/privateKeys')

// Map App IDs to Project Paths (relative to this script)
const PROJECT_MAP: Record<string, string> = {
  'wxa32e349ec0144dd5': '../../apps/mp-c/dist/build/mp-weixin', // mp-c
  'wxc67898cddb56cbbf': '../../apps/mp-b/dist/build/mp-weixin', // mp-b
}

async function main() {
  console.log('Starting member management...')
  console.log(`Keys Directory: ${KEYS_DIR}`)

  if (!fs.existsSync(KEYS_DIR)) {
    console.error(`Error: Keys directory does not exist: ${KEYS_DIR}`)
    process.exit(1)
  }

  const files = fs.readdirSync(KEYS_DIR)
  const keyFiles = files.filter(f => f.startsWith('private.') && f.endsWith('.key'))

  if (keyFiles.length === 0) {
    console.log('No private keys found. Exiting.')
    return
  }

  console.log(`Found ${keyFiles.length} private keys:`, keyFiles)

  for (const keyFile of keyFiles) {
    const appIdMatch = keyFile.match(/^private\.(.+)\.key$/)
    if (!appIdMatch) {
      console.warn(`Skipping invalid key filename: ${keyFile}`)
      continue
    }

    const appId = appIdMatch[1] || ''
    const privateKeyPath = path.join(KEYS_DIR, keyFile)
    const projectRelativePath = PROJECT_MAP[appId]

    if (!projectRelativePath) {
      console.warn(`No project mapped for App ID: ${appId}. Skipping.`)
      continue
    }

    const projectPath = path.resolve(__dirname, projectRelativePath)

    console.log(`\nProcessing App ID: ${appId}`)
    console.log(`Project Path: ${projectPath}`)
    console.log(`Private Key Path: ${privateKeyPath}`)

    if (!fs.existsSync(projectPath)) {
      console.error(`Error: Project path does not exist: ${projectPath}`)
      console.error('Please build the project first.')
      continue
    }

    try {
      const project = new ci.Project({
        appid: appId,
        type: 'miniProgram',
        projectPath,
        privateKeyPath,
        ignores: ['node_modules/**/*'],
      })

      const memberList = membersWechat.map(m => ({
        wechatid: m.wechat,
        remark: m.name
      }))

      console.log(`Adding ${memberList.length} experience members...`)

      const result = await ci.manageProjectMember({
        project,
        action: 'add_experiencer',
        robot: 1,
        member_list: memberList
      })

      console.log('Result:', result)

      if (result && result.errCode === 0) {
        console.log(`Successfully added members for ${appId}.`)
      } else {
        console.error(`Failed to add members for ${appId}.`)
      }

    } catch (error) {
      console.error(`An error occurred for ${appId}:`, error)
    }
  }
}

main()
