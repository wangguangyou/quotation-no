import { proxy, useSnapshot } from 'valtio'

type User = {
  name: string
  id: number
}
type Store = {
  user: Partial<User>
}
export const store = proxy<Store>({
  user: { id: 1 },
})

export const useUser = () => useSnapshot(store.user)
