import type { MpModel } from './model'

export abstract class MpService {
  static async login(args: MpModel.LoginParams): Promise<MpModel.LoginResponse> {
    // 模拟登录逻辑
    if (args.code === 'fail') {
      return {
        code: 500,
        msg: '登录失败',
        token: '',
      }
    }
    return {
      code: 200,
      msg: '登录成功',
      token: 'asdfw123kj',
    }
  }

  // 模拟内存数据库
  private static mockUser: MpModel.UserInfo = {
    userId: 12345,
    username: 'user_12345',
    nickname: '皮蛋萌',
    avatar: 'https://pub-a755381d2970462a828e2d91e8fedfe5.r2.dev/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_2025-12-12_103937_807.jpg',
    phone: '13800138000',
    gender: '保密',
    birthday: '2000-01-01',
    sitterInfo: {
      level: '高级宠托师',
      verified: true,
      serviceYears: 2,
    },
    stats: {
      rating: 4.9,
      orderCount: 128,
      fans: 356,
    },
    wallet: {
      balance: 1250.00,
      frozen: 200.00,
      incomeMonth: 3500.00,
    },
  }

  static async getUserInfo(): Promise<MpModel.GetUserInfoResponse> {
    return {
      code: 200,
      msg: 'success',
      data: {
        ...this.mockUser,
      },
    }
  }

  static async updateUserInfo(args: MpModel.UpdateUserInfoParams): Promise<MpModel.UpdateUserInfoResponse> {
    this.mockUser = {
      ...this.mockUser,
      ...args,
    }
    return {
      code: 200,
      msg: '更新成功',
      data: this.mockUser,
    }
  }

  static async uploadFile(file: File): Promise<MpModel.UploadFileResponse> {
    // 模拟文件上传，实际应保存文件并返回URL
    console.log('Upload file:', file.name, file.size)
    return {
      code: 200,
      msg: '上传成功',
      url: 'https://github.com/shadcn.png', // 模拟返回固定图片
    }
  }

  static async getGlobalConfig(): Promise<MpModel.GlobalConfigResponse> {
    return {
      code: 200,
      msg: 'success',
      data: {
        abTest: [
          { name: 'newHome', value: 'control' },
          { name: 'promotion', value: 'control' },
        ],
        mockList: [
          '/pet/detail',
        ],
        switches: {
          enableChat: true,
          enablePayment: true,
        },
        formOptions: {
          petTypes: [
            { label: '猫', value: 'cat' },
            { label: '狗', value: 'dog' },
            { label: '其他', value: 'other' },
          ],
          serviceTypes: [
            { label: '洗护', value: 'washing' },
            { label: '寄养', value: 'foster' },
            { label: '遛狗', value: 'walking' },
          ],
          catBreeds: [
            { label: '布偶猫', value: 'ragdoll' },
            { label: '英短', value: 'british_shorthair' },
            { label: '美短', value: 'american_shorthair' },
            { label: '加菲猫', value: 'exotic_shorthair' },
            { label: '中华田园猫', value: 'lihua' },
          ],
          dogBreeds: [
            { label: '金毛', value: 'golden_retriever' },
            { label: '拉布拉多', value: 'labrador' },
            { label: '柯基', value: 'corgi' },
            { label: '柴犬', value: 'shiba_inu' },
            { label: '边牧', value: 'border_collie' },
            { label: '泰迪', value: 'poodle' },
          ],
        },
        cities: [
          { code: '110000', name: '北京市' },
          { code: '310000', name: '上海市' },
          { code: '440100', name: '广州市' },
          { code: '440300', name: '深圳市' },
        ],
      },
    }
  }
}
