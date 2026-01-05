export function getPrefix(name: string, type: 'sitter' | 'owner'): string {
  return `/api/mock/${type}/${name}`
}
