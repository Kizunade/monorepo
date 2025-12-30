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
  }

  static async getUserInfo(): Promise<MpModel.GetUserInfoResponse> {
    return {
      code: 200,
      msg: 'success',
      data: this.mockUser,
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
}
