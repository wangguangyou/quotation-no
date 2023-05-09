import { proxy, snapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import type { RLPAGE, LoginUser as User, LoginRole } from '@/api/types'
import { getPageList } from '@/api'

type Store = {
  openPage: string[]
  user: Promise<User | null> | User | null
  // pageList: Promise<RLPAGE[] | null> | RLPAGE[]
  map: Record<string, string>
  showMenu: { key: string; label: string }[]
  isManager: boolean
  isClerk: boolean
  isBuyer: boolean
  isAdmin: boolean
  getCurrentPageCode: (pathname: string) => keyof Store['map'] | undefined
}
const auth = async (): Promise<User | null> => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    if (user) return JSON.parse(user)
    return null
  }
  return null
}

const state = proxy<Store>({
  openPage: ['/login'],
  user: auth(),
  // pageList: (async () => {
  //   const { data } = await getPageList()
  //   return data
  // })(),
  map: {
    quotation_page: '/no',
    personnel_management: '/user',
    quotation_statistics: '/list',
    parameter_management: '/param',
    authority_management: '/auth',
    offer_details: '/',
  },
  getCurrentPageCode(pathname: string) {
    for (const key in this.map) {
      const val = this.map[key]
      if (val === pathname) return key
    }
  },
  get showMenu(): { key: string; label: string }[] {
    const user: User | null = snapshot(state).user
    if (!user) return []
    return user.rlPages.map((item) => ({
      key: this.map[item.pageCode] || '/',
      label: item.pageName,
    }))
  },
  get isClerk(): boolean {
    const user: User | null = snapshot(state).user
    if (user instanceof Promise || user === null) {
      return false
    }
    return !!user.rlRoles.find((find: LoginRole) => find.roleCode === 'Clerk')
  },
  get isBuyer(): boolean {
    const user: User | null = snapshot(state).user
    if (user instanceof Promise || user === null) {
      return false
    }
    return !!user.rlRoles.find((find: LoginRole) => find.roleCode === 'Buyer')
  },
  get isManager(): boolean {
    const user: User | null = snapshot(state).user
    if (user instanceof Promise || user === null) {
      return false
    }
    return !!user.rlRoles.find((find: LoginRole) => find.roleCode === 'Manager')
  },
  get isAdmin(): boolean {
    const user: User | null = snapshot(state).user
    if (user instanceof Promise || user === null) {
      return false
    }
    return !!user.rlRoles.find((find: LoginRole) => find.roleCode === 'Admin')
  },
})
subscribeKey(state, 'user', () => {
  if (state.user instanceof Promise) {
    localStorage.removeItem('user')
  } else {
    localStorage.setItem('user', JSON.stringify(state.user))
  }
})

export default state
