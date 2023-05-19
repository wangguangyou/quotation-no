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
  rlPageList?: RLPAGE[]
}
export interface LoginRole {
  id: number
  roleName: string
  roleCode: string
  createTime: string
}
export type LoginUser = {
  username: string
  nickname: string
  token: string
  tokenExpire: number
  rlPages: Readonly<RLPAGE[]>
  rlRoles: Readonly<LoginRole[]>
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
  value?: number
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
  createUser?: string
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
  // weight: number
}
export interface PR {
  id: number
  primerName: string
  piecePrice: number
  coilPrice: number
  // pieceWeight: number
  // coilWeight: number
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
  clerkComplete: boolean
  customerInfo: string
  customerPosition: string
  customerPrice: string
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
  fabric: string
  primer: string
  transport: string
  edgeProcess: string
  printMethod: string
}

export interface QuotationParam {
  length: number
  width: number
  height: number
  size: number
  shippingPayment: number
  placement?: number
  printMethod?: PrintMethod
  edgeProcessParam?: EdgeProcessParam
  materialParam?: MaterialParam
  primerParam?: MaterialParam
  packageParam: PackageParam
  accyParam: AccyParam
  taxRateParam: MaterialParam
  badRateParam: BadRateParam
  freightParam: MaterialParam
  customerParam: CustomerParam
  freight: number
}
interface CustomerParam {
  info: string
  position: string
  price: string
}
interface BadRateParam {
  inputRate: number
}

interface AccyParam {
  accyItemList: AccyItem[]
}

export interface AccyItem {
  id: number
  name: string
  qty: number
  price: number
  material: string
  size: string
  print: string
  other: string
  perPrice: number
}
interface PackageParam {
  row?: number
  col?: number
  layer?: number
  pcs?: number
  volume?: number
  weight?: number
  boxLength?: number
  boxWidth?: number
  boxHeight?: number
  length?: number
  width?: number
  height?: number
}

interface MaterialParam {
  mapId: number
}

interface EdgeProcessParam {
  code: string
  needDriverChip: boolean
}

interface PrintMethod {
  code: string
  stencilCount: number
  silkPrintCount: number
}
export interface SimpleStats {
  totalAmount: number
  toBePerfectedAmount: number
  toBeCompletedAmount: number
  completeAmount: number
  allQuotation: number
  toBePerfectedQuotation: number
  toBeCompletedQuotation: number
  completeQuotation: number
}
