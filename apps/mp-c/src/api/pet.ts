import type { PetModel } from '@mock/pet/model'
import { http } from '@/http/alova'

export function getPetList() {
  return http.Get<PetModel.GetPetListResponse>('/pet/list')
}

export function addPet(data: PetModel.AddPetParams) {
  return http.Post<PetModel.AddPetResponse>('/pet', data)
}

export function updatePet(data: PetModel.UpdatePetParams) {
  return http.Put<PetModel.UpdatePetResponse>('/pet', data)
}

export function deletePet(data: PetModel.DeletePetParams) {
  return http.Delete<PetModel.DeletePetResponse>('/pet', data)
}

export function getPetDetail(data: PetModel.FindByIdParams) {
  return http.Get<PetModel.FindByIdResponse>('/pet', {
    params: data,
  })
}
