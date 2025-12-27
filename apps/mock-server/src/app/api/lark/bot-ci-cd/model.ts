import type { ELYSIA_FORM_DATA } from 'elysia'
import { t } from 'elysia'

export const TOOL_NAME = 'bot-ci-cd'

export namespace BotCiCdModel {
  export enum BuildStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
  }

  // Schema for validation within Service (excluding file object which is handled separately or passed as any/Blob)
  export const webhookPayloadSchema = t.Form({
    'status': t.Enum(BotCiCdModel.BuildStatus, {
      description: '打包状态',
      default: BotCiCdModel.BuildStatus.SUCCESS,
    }),
    'commit-message': t.Optional(t.String({
      description: '提交记录',
    })),
    'error-message': t.Optional(t.String({
      description: '错误信息',
    })),
    'qrcode': t.Optional(t.File({
      description: '预览二维码文件',
    })),
    'mission': t.Optional(t.String({
      description: '任务名称',
    })),
    'log-url': t.Optional(t.String({
      description: '日志 URL',
    })),
  })

  export type WebhookParams = (typeof webhookPayloadSchema.static)[ELYSIA_FORM_DATA]

  export const ajaxResult = t.Object({
    code: t.Number({
      description: '状态码',
    }),
    msg: t.String({
      description: '消息',
    }),
    data: t.Any(),
  })

  export type AjaxResult = typeof ajaxResult.static
}
