import type { AddressModel } from '@mock/address/model'
import { http } from '@/http/alova'

/**
 * 新增地址
 * @param data 地址信息
 */
export function addAddress(data: AddressModel.Address) {
  return http.Post<void>('/address', data)
}

/**
 * 修改地址
 * @param data 地址信息
 */
export function updateAddress(data: AddressModel.Address) {
  return http.Put<void>('/address', data)
}

/**
 * 删除地址
 * @param addrId 地址ID
 */
export function deleteAddress(addrId: number | string) {
  return http.Delete<void>(`/address/${addrId}`)
}

/**
 * 查询地址列表
 * @param params 查询参数
 */
export function getAddressList(params?: AddressModel.ListParams) {
  return http.Get<AddressModel.PageResultAddress>('/address/list', {
    params,
  })
}
