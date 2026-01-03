export function isMatchMock(url: string, method: string, list: string[]): boolean {
  const targetMethod = method.toLowerCase()

  return list.some((pattern) => {
    let patternMethod = ''
    let patternPath = pattern

    // 解析 method:path 格式
    // 注意：url 本身可能包含 : (虽然这里是 path，通常不含 scheme，但以防万一)
    // 约定 method:path 格式中 method 不包含 /，且在开头
    if (/^[a-zA-Z]+:/i.test(pattern)) {
      const parts = pattern.split(':')
      patternMethod = parts[0].toLowerCase()
      patternPath = parts.slice(1).join(':')
    }

    // 如果指定了 method 且不匹配，则跳过
    if (patternMethod && patternMethod !== targetMethod) {
      return false
    }

    // 处理通配符
    if (patternPath.includes('*')) {
      // 转义正则特殊字符，除了 *
      const escaped = patternPath.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      // 将 * 替换为 .*
      const regexStr = `^${escaped.replace(/\*/g, '.*')}$`
      const regex = new RegExp(regexStr)
      return regex.test(url)
    }

    // 精确匹配
    return patternPath === url
  })
}
