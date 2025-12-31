import type { PetModel } from './model'

export abstract class PetService {
  public static pets: PetModel.Pet[] = [
    { id: 1, name: '可乐', avatar: 'https://placecats.com/200/200', breed: '加菲猫', age: '2岁', gender: 'male' },
    { id: 2, name: '团团', avatar: 'https://placecats.com/201/200', breed: '金毛', age: '1岁', gender: 'female' },
    { id: 3, name: '球球', avatar: 'https://placecats.com/200/201', breed: '布偶猫', age: '3个月', gender: 'female' },
  ]

  static async getList(): Promise<PetModel.GetPetListResponse> {
    return {
      code: 200,
      msg: 'success',
      data: this.pets,
    }
  }

  static async add(args: PetModel.AddPetParams): Promise<PetModel.AddPetResponse> {
    const newPet: PetModel.Pet = {
      ...args,
      id: Math.floor(Math.random() * 10000) + 100,
    }
    this.pets.push(newPet)
    return {
      code: 200,
      msg: '添加成功',
      data: newPet,
    }
  }

  static async update(args: PetModel.UpdatePetParams): Promise<PetModel.UpdatePetResponse> {
    const index = this.pets.findIndex(p => p.id === args.id)
    if (index === -1) {
      return {
        code: 500,
        msg: '宠物不存在',
        data: this.pets[0],
      }
    }
    this.pets[index] = { ...this.pets[index], ...args }
    return {
      code: 200,
      msg: '更新成功',
      data: this.pets[index],
    }
  }

  static async delete(args: PetModel.DeletePetParams): Promise<PetModel.DeletePetResponse> {
    this.pets = this.pets.filter(p => p.id !== args.id)
    return {
      code: 200,
      msg: '删除成功',
    }
  }
}
