import z from 'zod'

export const TOOL_NAME = 'demo'

export namespace LarkDemoModel {
  export const sendMessageSchema = z.object({
    appId: z.string().optional().describe('App ID'),
    appSecret: z.string().optional().describe('App Secret'),
    receiveId: z.string().describe('接收者ID'),
    receiveIdType: z.enum(['open_id', 'user_id', 'union_id', 'email', 'chat_id']).default('open_id').describe('接收者ID类型'),
    msgType: z.enum(['text', 'post', 'image', 'file', 'audio', 'media', 'sticker', 'interactive', 'share_chat', 'share_user']).default('text').describe('消息类型'),
    content: z.string().describe('消息内容(JSON字符串)'),
  }).describe('发送消息参数')

  export const ajaxResult = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('消息'),
    data: z.any().optional().describe('数据'),
  }).describe('统一响应结果')

  export type SendMessageParams = z.infer<typeof sendMessageSchema>
  export type AjaxResult = z.infer<typeof ajaxResult>
}
