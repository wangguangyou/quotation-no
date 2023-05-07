declare module 'dayjs'
declare module '@ant-design/plots'
interface Base<T> {
  status: boolean
  data: T
}

interface Pagination<T> {
  pageCurrent: number
  pageSize: number
  total: number
  list: T
  from: number
}

type JavaResponse<T> = Promise<Base<T>>
type JavaResponsePagination<T> = Promise<Base<Pagination<T>>>

type unwrapBase<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<Base<infer R>>
  ? R
  : any

type unwrapResponse<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<Base<Pagination<infer R>>>
  ? R
  : unwrapBase<T>

interface Option {
  value: number
  label: string
}
