import z from 'zod'

export const TOOL_NAME = 'pet'

export namespace PetModel {
  export const pet = z.object({
    id: z.number().describe('宠物ID'),
    name: z.string().describe('宠物昵称'),
    type: z.enum(['cat', 'dog']).describe('宠物类型'),
    avatar: z.string().describe('宠物头像'),
    breed: z.string().optional().describe('宠物品种'),
    birthday: z.number().optional().describe('生日(时间戳)'),
    gender: z.enum(['male', 'female']).optional().describe('宠物性别'),
    weight: z.number().optional().describe('体重(kg)'),
    sterilized: z.boolean().optional().describe('是否绝育'),
    isOwner: z.boolean().optional().default(false).describe('是否是当前用户的宠物'),
  }).describe('宠物信息')

  export const petList = z.array(pet).describe('宠物列表')

  export const getPetListResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    data: petList,
  }).describe('获取宠物列表响应（全量返回不分页）')

  export const addPetParams = pet.omit({ id: true }).describe('添加宠物参数')

  export const addPetResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    data: pet,
  }).describe('添加宠物响应')

  export const updatePetParams = pet.partial().required({ id: true }).describe('更新宠物参数')

  export const updatePetResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    data: pet,
  }).describe('更新宠物响应')

  export const deletePetParams = z.object({
    id: z.number().describe('宠物ID'),
  }).describe('删除宠物参数')

  export const deletePetResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    data: z.null().optional(),
  }).describe('删除宠物响应')

  export const findByIdParams = z.object({
    id: z.string().transform(val => Number.parseInt(val, 10)).describe('宠物ID'),
  }).describe('查询宠物详情参数')

  export const findByIdResponse = z.object({
    code: z.number().describe('状态码'),
    msg: z.string().describe('提示信息'),
    data: pet.describe('宠物详情'),
  }).describe('查询宠物详情响应')

  export type Pet = z.infer<typeof pet>
  export type AddPetParams = z.infer<typeof addPetParams>
  export type UpdatePetParams = z.infer<typeof updatePetParams>
  export type DeletePetParams = z.infer<typeof deletePetParams>
  export type FindByIdParams = z.infer<typeof findByIdParams>

  export type GetPetListResponse = z.infer<typeof getPetListResponse>
  export type AddPetResponse = z.infer<typeof addPetResponse>
  export type UpdatePetResponse = z.infer<typeof updatePetResponse>
  export type DeletePetResponse = z.infer<typeof deletePetResponse>
  export type FindByIdResponse = z.infer<typeof findByIdResponse>
}
