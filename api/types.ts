export interface Base<T> {
  status: boolean
  data: T
}

export interface Pagination<T> {
  pageCurrent: number
  pageSize: number
  total: number
  list: T
  from: number
}

export type Response<T> = Promise<Base<T>>
export type ResponsePagination<T> = Promise<Base<Pagination<T>>>

type unwrapBase<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<Base<infer R>>
  ? R
  : any

export type unwrapResponse<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<Base<Pagination<infer R>>>
  ? R
  : unwrapBase<T>

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

export interface ParentUnit {
  id: number
  unitName: string
  unitCode: string
  createTime: string
  updateTime: string
}

export interface User {
  id: number
  username: string
  nickname: string
  createTime: string
  isDelete: boolean
  roleList: RoleOfUser[]
}

export interface RoleOfUser {
  id: number
  roleName: string
  createTime: string
  userId: number
}
