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
export interface SubUnit {
  id: number
  unitId: number
  typeName: string
  typeCode: string
  createTime: string
  updateTime: string
  typeEnable: boolean
}

export interface Check {
  typeCode: string
  error: string
  hasError: boolean
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
export interface Fixed {
  id: number
  computeTypeId: number
  valueCode: string
  valueName: string
  value: number
  createTime: string
  updateTime: string
}
export interface BadMap {
  id: number
  length: number
  width: number
  size: number
  rate: number
}
export interface RangeMap {
  id: number
  minLength: number
  minWidth: number
  maxLength: number
  maxWidth: number
  size: number
  rate: number
}
export interface Fre {
  id: number
  company: string
  kgPrice: number
}

export interface MT {
  id: number
  materialName: string
  price: number
  weight: number
}
export interface PR {
  id: number
  primerName: string
  piecePrice: number
  coilPrice: number
  pieceWeight: number
  coilWeight: number
}
export interface Tax {
  id: number
  rateName: string
  rateValue: number
}

export interface POL {
  id: number
  length: number
  width: number
  price: number
}

export interface LSOL {
  id: number
  length: number
  price: number
}

export interface UV {
  id: number
  size: number
  price: number
}

export interface LCP {
  id: number
  length: number
  width: number
  size: number
  price: number
}
export interface Accy {
  id: number
  accyName: string
}
export interface Quotation {
  id: number
  userId: number
  buyerId: number
  managerId: number
  length: number
  width: number
  height: number
  size: number
  quotedPrice: number //最终价格
  costPrice: number //成本价格
  taxPrice: number //税后价格
  profit: number //利润
  profitMargin: number //利润率
  isDelete: boolean
  quotedStatus: number
  createTime: string
  updateTime: string
  clerk: string
  buyer: string
  manager: string
  profitPercentage: string // 利润率
  additional: boolean
  reject: boolean // 是香退回
}
