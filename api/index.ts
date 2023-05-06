import { GET, POST, PUT, DELETE } from './_config'
import {
  Role,
  RLPAGE,
  User,
  ParentUnit,
  SubUnit,
  Check,
  LoginUser,
  ComputedResult,
} from './types'

export const getLogin = (data: any): JavaResponse<LoginUser> =>
  POST('/user/login', data)

export const getRlPage = (data: any) => GET('/user/rl/page', data)

export const createUser = (data: any) => POST('/user/create', data)

export const editUser = (id: number, data: any) => PUT(`/user/edit/${id}`, data) //管理员修改用户

export const delUser = (id: number, data?: any) =>
  DELETE(`/user/delete/${id}`, data) //管理员删除用户

export const editPassword = (data: any) => PUT(`/user/edit/password`, data)

export const editUserInfo = (data: any) => PUT(`/user/edit/info`, data)

export const getUserList = (data: any): JavaResponsePagination<User[]> =>
  GET(`/user/page`, data)

export const createRole = (data: any) => POST('/role/create', data)

export const editRole = (id: number, data: any) => PUT(`/role/edit/${id}`, data)

export const delRole = (id: number, data: any) =>
  DELETE(`/role/delete/${id}`, data)

export const roleRlUser = (id: number, data: { userId: number }) =>
  PUT(`/role/rl/user/${id}`, data)

export const delRoleRlUser = (id: number, data: { userId: number }) =>
  DELETE(`/role/rl/user/${id}`, data)

export const roleRlPage = (id: number, data: { pageIds: number[] }) =>
  PUT(`/role/rl/page/${id}`, data)

export const delRoleRlPage = (id: number, data: { pageIds: number[] }) =>
  DELETE(`/role/rl/page/${id}`, data)

export const getRoleList = (data?: any): JavaResponse<Role[]> =>
  GET(`/role/list`, data)

export const getPageList = (data?: any): JavaResponse<RLPAGE[]> =>
  GET(`/page/list`, data)

//获取计算父类列表
export const getComputeUnit = (data?: any): JavaResponse<ParentUnit[]> =>
  GET(`/compute/unit`, data)

//获取计算子类列表
export const getSubComputeUnit = (
  path: string,
  data?: any
): JavaResponse<SubUnit[]> => GET(`/compute/unit/${path}`, data)

//参数检测
export const checkCompute = (data: any): JavaResponse<[Check, Check]> =>
  POST(`/compute/check`, data)

export const combCompute = (data: any): JavaResponse<ComputedResult> =>
  POST(`/compute/comb`, data)
