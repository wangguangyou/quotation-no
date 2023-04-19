import { proxy, subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import type { MenuProps } from 'antd'
type MenuItem = Required<MenuProps>['items'][number]

type RLPAGE = {
  id: number
  pageName: string
  pageCode: string
  createTime: string
}

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
  token?: string
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
      label: '明细',
    },
  ]
  get showMenu() {
    return this.menu
  }
  get token() {
    if (this.user instanceof Promise) {
      return null
    } else {
      return (this.user as User)?.token
    }
  }
}
const state = proxy<Store>(new State())
subscribeKey(state, 'user', () => {
  console.log(12, state.user)
  localStorage.setItem('user', JSON.stringify(state.user))
})

export default state
