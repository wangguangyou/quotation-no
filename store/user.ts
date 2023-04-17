import { proxy } from 'valtio'
import type { MenuProps } from 'antd'
type MenuItem = Required<MenuProps>['items'][number]

type User = {
  account: string
  name: string
  id: number
} | null
class State {
  user!: Partial<User>
  menu: MenuItem[] = [
    {
      key: 1,
      label: '明细',
    },
  ]
  get showMenu() {
    return this.menu
  }
}

const state = proxy(new State())

export default state
