import { proxy, subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import type { MenuProps } from 'antd'
import type { RLPAGE } from '@/types'
type MenuItem = Required<MenuProps>['items'][number]

type User = {
  username: string
  nickname: string
  token: string
  tokenExpire: number
  rlPages: RLPAGE[]
}
type Store = {
  user: Promise<User | null> | User | null
  menu: MenuItem[]
  showMenu: MenuItem[]
  // token: string | null
}
const auth = async (): Promise<User | null> => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    if (user) return JSON.parse(user)
    return null
  }
  return null
}
class State {
  user = auth()

  menu = [
    {
      key: 1,
      label: '报价单明细',
    },
    {
      key: 2,
      label: '报价单统计',
      code: 'list',
    },
    {
      key: 3,
      label: '辅料管理',
      code: 'template',
    },
    {
      key: 4,
      label: '用户管理',
      code: 'user_manager',
    },
    {
      key: 5,
      label: '权限管理',
      code: 'auth_manager',
    },
  ]
  get showMenu() {
    const map: Record<string, string> = {
      user_manager: '/user',
      list: '/list',
      template: '/template',
      auth_manager: '/auth',
      print_method_manager: '/',
    }

    return this.menu.map((item) => ({
      key: map[item.code!] || '/',
      label: item.label,
    }))
  }
}
const state = proxy<Store>(new State())
subscribeKey(state, 'user', () => {
  if (state.user instanceof Promise) {
    localStorage.removeItem('user')
  } else {
    localStorage.setItem('user', JSON.stringify(state.user))
  }
})

export default state
