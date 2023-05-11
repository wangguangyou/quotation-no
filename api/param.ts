import { GET, POST, PUT, DELETE } from './_config'

import {
  Fixed,
  BadMap,
  RangeMap,
  Fre,
  MT,
  PR,
  Tax,
  POL,
  LSOL,
  UV,
  LCP,
  Accy,
} from './types'
//获取固定参数列表
export const getFixedParam = (data?: any): JavaResponse<Fixed[]> =>
  GET('/param/fixed/list', data)

export const editFixedParam = (id: number, data: { newValue: number }) =>
  PUT(`/param/fixed/update/${id}`, data)

//常规不良率添加
export const getBadMapPage = (data?: any): JavaResponsePagination<BadMap[]> =>
  GET('/param/bad/map/page', data)

export const addBadMap = (data: Omit<BadMap, 'id'>) =>
  POST('/param/bad/map/add', data)

export const editBadMap = (id: BadMap['id'], data: Omit<BadMap, 'id'>) =>
  PUT(`/param/bad/map/update/${id}`, data)

export const delBadMap = (id: BadMap['id'], data?: any) =>
  DELETE(`/param/bad/map/delete/${id}`, data)

//非常规不良率添加
export const getBadRangePage = (
  data?: any
): JavaResponsePagination<RangeMap[]> => GET('/param/bad/range/page', data)

export const addBadRange = (data: Omit<RangeMap, 'id'>) =>
  POST('/param/bad/range/add', data)

export const editBadRange = (id: RangeMap['id'], data: Omit<RangeMap, 'id'>) =>
  PUT(`/param/bad/range/update/${id}`, data)

export const delBadRange = (id: RangeMap['id'], data?: any) =>
  DELETE(`/param/bad/range/delete/${id}`, data)

//物流公司运费参数
export const getFrePage = (data?: any): JavaResponsePagination<Fre[]> =>
  GET('/param/fre/page', data)

export const getFreAll = (data?: any): JavaResponse<Fre[]> =>
  GET('/param/fre/all', data)

export const addFre = (data: Omit<Fre, 'id'>) => POST('/param/fre/add', data)

export const editFre = (id: Fre['id'], data: Omit<Fre, 'id'>) =>
  PUT(`/param/fre/update/${id}`, data)

export const delFre = (id: Fre['id'], data?: any) =>
  DELETE(`/param/fre/delete/${id}`, data)

//面料
export const getMtPage = (data?: any): JavaResponsePagination<MT[]> =>
  GET('/param/mt/page', data)

export const getMtAll = (data?: any): JavaResponse<MT[]> =>
  GET('/param/mt/all', data)

export const addMt = (data: Omit<MT, 'id'>) => POST('/param/mt/add', data)

export const editMt = (id: MT['id'], data: Omit<MT, 'id'>) =>
  PUT(`/param/mt/update/${id}`, data)

export const delMt = (id: MT['id'], data?: any) =>
  DELETE(`/param/mt/delete/${id}`, data)

//底料
export const getPrPage = (data?: any): JavaResponsePagination<PR[]> =>
  GET('/param/pr/page', data)

export const getPrAll = (data?: any): JavaResponse<PR[]> =>
  GET('/param/pr/all', data)

export const addPr = (data: Omit<PR, 'id'>) => POST('/param/pr/add', data)

export const editPr = (id: PR['id'], data: Omit<PR, 'id'>) =>
  PUT(`/param/pr/update/${id}`, data)

export const delPr = (id: PR['id'], data?: any) =>
  DELETE(`/param/pr/delete/${id}`, data)

//税率
export const getTaxPage = (data?: any): JavaResponsePagination<Tax[]> =>
  GET('/param/tax/page', data)

export const getTaxAll = (data?: any): JavaResponse<Tax[]> =>
  GET('/param/tax/all', data)

export const addTax = (data: Omit<Tax, 'id'>) => POST('/param/tax/add', data)

export const editTax = (id: Tax['id'], data: Omit<Tax, 'id'>) =>
  PUT(`/param/tax/update/${id}`, data)

export const delTax = (id: Tax['id'], data?: any) =>
  DELETE(`/param/tax/delete/${id}`, data)

//辅料明细
export const getAccyPage = (data?: any): JavaResponsePagination<Accy[]> =>
  GET('/param/accy/page', data)

export const getAccyAll = (data?: any): JavaResponse<Accy[]> =>
  GET('/param/accy/all', data)

export const addAccy = (data: Omit<Accy, 'id'>) => POST('/param/accy/add', data)

export const editAccy = (id: Accy['id'], data: Omit<Accy, 'id'>) =>
  PUT(`/param/accy/update/${id}`, data)

export const delAccy = (id: Accy['id'], data?: any) =>
  DELETE(`/param/accy/delete/${id}`, data)

//边缘处理-精密锁边
export const getPolPage = (data?: any): JavaResponsePagination<POL[]> =>
  GET('/param/ep/pol/page', data)

export const addPol = (data: Omit<POL, 'id'>) => POST('/param/ep/pol/add', data)

export const editPol = (id: POL['id'], data: Omit<POL, 'id'>) =>
  PUT(`/param/ep/pol/update/${id}`, data)

export const delPol = (id: POL['id'], data?: any) =>
  DELETE(`/param/ep/pol/delete/${id}`, data)

//边缘处理-发光条
export const getLSOLPage = (data?: any): JavaResponsePagination<LSOL[]> =>
  GET('/param/ep/lsol/page', data)

export const addLSOL = (data: Omit<LSOL, 'id'>) =>
  POST('/param/ep/lsol/add', data)

export const editLSOL = (id: LSOL['id'], data: Omit<LSOL, 'id'>) =>
  PUT(`/param/ep/lsol/update/${id}`, data)

export const delLSOL = (id: LSOL['id'], data?: any) =>
  DELETE(`/param/ep/lsol/delete/${id}`, data)

//打印方式-uv
export const getUVPage = (data?: any): JavaResponsePagination<UV[]> =>
  GET('/param/pm/uv/page', data)

export const addUV = (data: Omit<UV, 'id'>) => POST('/param/pm/uv/add', data)

export const editUV = (id: UV['id'], data: Omit<UV, 'id'>) =>
  PUT(`/param/pm/uv/update/${id}`, data)

export const delUV = (id: UV['id'], data?: any) =>
  DELETE(`/param/pm/uv/delete/${id}`, data)

//打印方式-大货纸
export const getLCPPage = (data?: any): JavaResponsePagination<LCP[]> =>
  GET('/param/pm/lcp/page', data)

export const addLCP = (data: Omit<LCP, 'id'>) => POST('/param/pm/lcp/add', data)

export const editLCP = (id: LCP['id'], data: Omit<LCP, 'id'>) =>
  PUT(`/param/pm/lcp/update/${id}`, data)

export const delLCP = (id: LCP['id'], data?: any) =>
  DELETE(`/param/pm/lcp/delete/${id}`, data)

//重量
export const getWeightPage = (data?: any): JavaResponsePagination<LCP[]> =>
  GET('/param/weight/page', data)

export const addWeight = (data: Omit<LCP, 'id'>) =>
  POST('/param/weight/add', data)

export const editWeight = (id: LCP['id'], data: Omit<LCP, 'id'>) =>
  PUT(`/param/weight/update/${id}`, data)

export const delWeight = (id: LCP['id'], data?: any) =>
  DELETE(`/param/weight/delete/${id}`, data)
