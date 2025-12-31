import type { PetModel } from '@mock/pet/model'
import { http } from '@/http/alova'

export function getPetList() {
  return http.Get<PetModel.GetPetListResponse>('/pet/list')
}

export function addPet(data: PetModel.AddPetParams) {
  return http.Post<PetModel.AddPetResponse>('/pet/add', data)
}

export function updatePet(data: PetModel.UpdatePetParams) {
  return http.Post<PetModel.UpdatePetResponse>('/pet/update', data)
}

export function deletePet(data: PetModel.DeletePetParams) {
  return http.Post<PetModel.DeletePetResponse>('/pet/delete', data)
}

export function getPetDetail(data: PetModel.FindByIdParams) {
  return http.Get<PetModel.FindByIdResponse>('/pet/detail', { params: data })
}
