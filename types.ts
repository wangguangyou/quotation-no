export interface Role {
  id: number
  roleName: string
  createTime: string
  rlPageList: RLPAGE[]
}

export interface RLPAGE {
  id: number
  pageName: string
  pageCode: string
  createTime: string
}
