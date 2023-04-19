import { GET, POST } from './_config'
import type { LoginParams } from './types'

export const getLogin = (data: any) => POST('/user/login', data)

// export const useUser = (id: number) => useSWR([`/users/${id}`], GET)
