import { openapi } from '@elysiajs/openapi'
import { serverTiming } from '@elysiajs/server-timing'
import { Elysia } from 'elysia'
import { getPrefix } from '@/lib/utils/getPrefix'
import { PetModel, TOOL_NAME } from '../model'
import { PetService } from '../service'

const app = new Elysia({ prefix: getPrefix(TOOL_NAME) })
  .use(
    openapi(),
  )
  .use(serverTiming())
  .get(
    '/list',
    () => {
      return PetService.getList()
    },
    {
      response: PetModel.getPetListResponse,
      detail: {
        summary: '获取宠物列表',
        tags: ['宠物管理'],
        operationId: 'getPetList',
      },
    },
  )
  .post(
    '/add',
    ({ body }) => {
      return PetService.add(body as PetModel.AddPetParams)
    },
    {
      body: PetModel.addPetParams,
      response: PetModel.addPetResponse,
      detail: {
        summary: '添加宠物',
        tags: ['宠物管理'],
        operationId: 'addPet',
      },
    },
  )
  .post(
    '/update',
    ({ body }) => {
      return PetService.update(body as PetModel.UpdatePetParams)
    },
    {
      body: PetModel.updatePetParams,
      response: PetModel.updatePetResponse,
      detail: {
        summary: '更新宠物',
        tags: ['宠物管理'],
        operationId: 'updatePet',
      },
    },
  )
  .post(
    '/delete',
    ({ body }) => {
      return PetService.delete(body as PetModel.DeletePetParams)
    },
    {
      body: PetModel.deletePetParams,
      response: PetModel.deletePetResponse,
      detail: {
        summary: '删除宠物',
        tags: ['宠物管理'],
        operationId: 'deletePet',
      },
    },
  )
  .get(
    '/detail',
    ({ query }) => {
      return PetService.findById(query as unknown as PetModel.FindByIdParams)
    },
    {
      query: PetModel.findByIdParams,
      response: PetModel.findByIdResponse,
      detail: {
        summary: '获取宠物详情',
        tags: ['宠物管理'],
        operationId: 'getPetDetail',
      },
    },
  )

export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch
