import type { PetModel } from '@mock/pet/model'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addPet, deletePet, getPetList, updatePet } from '@/api/pet'

export const usePetStore = defineStore(
  'pet',
  () => {
    const pets = ref<PetModel.Pet[]>([])

    const setPets = (list: PetModel.Pet[]) => {
      pets.value = list
    }

    const fetchPets = async () => {
      const res = await getPetList()
      if (res.code === 200) {
        pets.value = res.data
      }
      return res
    }

    const add = async (params: PetModel.AddPetParams) => {
      const res = await addPet(params)
      if (res.code === 200) {
        pets.value.push(res.data)
        return true
      }
      return false
    }

    const update = async (params: PetModel.UpdatePetParams) => {
      const res = await updatePet(params)
      if (res.code === 200) {
        const index = pets.value.findIndex(p => p.id === res.data.id)
        if (index !== -1) {
          pets.value[index] = res.data
        }
        return true
      }
      return false
    }

    const remove = async (id: number) => {
      const res = await deletePet({ id })
      if (res.code === 200) {
        pets.value = pets.value.filter(p => p.id !== id)
        return true
      }
      return false
    }

    return {
      pets,
      setPets,
      fetchPets,
      add,
      update,
      remove,
    }
  },
  {
    persist: true,
  },
)
