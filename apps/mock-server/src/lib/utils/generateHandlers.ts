import type Elysia from 'elysia'

export function generateHandlers(app: Elysia<any, any>) {
  return {
    GET: app.fetch,
    POST: app.fetch,
    PUT: app.fetch,
    DELETE: app.fetch,
  }
}
