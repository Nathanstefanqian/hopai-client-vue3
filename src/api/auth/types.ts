export interface LoginVO {
  phoneCode: string // wx.getPhoneNumber获得
  loginCode: any // wx.login方法获得
  userType: number // 3 摄影师
}


export interface UserVO {
  registerStatus: number
  userId: number
  id: number
  avatar: string | undefined
  birthday: number | undefined
  babyBirthday: number | undefined
  weddingAnniversary: number | undefined
  createTime: number | undefined
  areaIds: Array<string>
  loginDate: number | undefined
  loginIp: string
  mark: string
  mobile: string
  name: string | undefined
  nickname: string | undefined
  registerIp: string
  sex: number
  status: number
  areaId: number | undefined
  areaName: string | undefined
  areaNames: Array<string>
  levelName: string | null
  levelId: string
  bizList: Array<string>
  idCard: string
  categoryIds: Array<string>
}