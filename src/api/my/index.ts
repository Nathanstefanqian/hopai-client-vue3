import request from '@/utils/request'

export interface LoginVO {
  phoneCode: string // wx.getPhoneNumber获得
  loginCode: any // wx.login方法获得
  userType: number // 3 摄影师  1 客户
}

// 获取用户个人资料
export const getUserInfo = async ()=> {
  return await request.get('/member/user/get')
}

// 更新用户个人资料
export const updateUserInfo = async (data: any)=> {
  return await request.post('/member/user/update', data)
}

// {
//   "nickname": "李四",
//   "avatar": "https://www.iocoder.cn/x.png",
//   "birthday": "",
//   "weddingAnniversary": "",
//   "babyBirthday": ""
// }

// 获取地区树
export const getArea = async () => {
  return await request.get('/system/area/tree')
}