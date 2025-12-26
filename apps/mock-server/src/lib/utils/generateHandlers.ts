import type Elysia from 'elysia'

export function generateHandlers(app: Elysia<any, any>) {
  async function handle(req: Request) {
    const res = await app.fetch(req)

    // 拦截 OpenAPI JSON 请求，去除路径前缀
    if (req.url.includes('/openapi/json')) {
      const data = await res.json() as any
      if (data.paths) {
        const newPaths: Record<string, any> = {}
        Object.keys(data.paths).forEach((key) => {
          const newKey = key.replace('/api/mock', '')
          newPaths[newKey] = data.paths[key]
        })
        data.paths = newPaths
      }
      return Response.json(data)
    }

    return res
  }

  return {
    GET: handle,
    POST: handle,
    PUT: handle,
    DELETE: handle,
  }
}
