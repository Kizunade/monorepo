import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const cwd = process.cwd()
// 指向 monorepo 根目录下的 node_modules/wot-design-uni
const target = path.resolve(cwd, '../../node_modules/wot-design-uni')
// 本地 node_modules 下的 wot-design-uni
const linkPath = path.resolve(cwd, 'node_modules/wot-design-uni')
const nodeModulesPath = path.dirname(linkPath)

function createSymlink() {
  // 1. 确保 node_modules 目录存在
  if (!fs.existsSync(nodeModulesPath)) {
    fs.mkdirSync(nodeModulesPath, { recursive: true })
  }

  // 2. 检查软链是否已存在
  if (fs.existsSync(linkPath)) {
    const stats = fs.lstatSync(linkPath)
    if (stats.isSymbolicLink()) {
      // 检查链接指向是否正确（可选）
      const currentTarget = fs.readlinkSync(linkPath)
      // 简单判断下，如果是软链就认为 ok，或者可以 log 一下
      console.log('[link-wot-design] Symlink already exists.')
      return
    }
    // 如果是目录或文件，先删除
    console.log('[link-wot-design] Path exists but is not a symlink. Removing...')
    fs.rmSync(linkPath, { recursive: true, force: true })
  }

  // 3. 检查目标是否存在
  if (!fs.existsSync(target)) {
    console.warn(`[link-wot-design] Target not found at ${target}. Skipping symlink creation. Please ensure dependencies are installed in root.`)
    return
  }

  // 4. 创建软链接
  try {
    // type: 'dir' (junction on Windows)
    fs.symlinkSync(target, linkPath, 'dir')
    console.log('[link-wot-design] Symlink created successfully.')
  }
  catch (error) {
    console.error('[link-wot-design] Failed to create symlink:', error)
    process.exit(1)
  }
}

createSymlink()
