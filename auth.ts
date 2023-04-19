import localforage from 'localforage'

const DELAY = 500

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export type AuthData = {
  refreshToken: string
  role: string
  name: string
}

const user: AuthData = {
  refreshToken: '__TOKEN__',
  role: 'admin',
  name: 'MISSING',
}

export const auth = {
  login: async (username: string, password: string) =>
    delay(DELAY).then(() => {
      if (username && password.includes('happy')) {
        return auth
          .setAuthData({ ...user, name: username })
          .then(() => ({ ...user, name: username }))
      }
      throw Error('Wrong username and password')
    }),
  refresh: async (): Promise<AuthData | null> => {
    const data = await auth.getAuthData()
    return delay(DELAY).then(() =>
      data?.refreshToken === '__TOKEN__' ? data : null
    )
  },
  logout: async () => auth.removeAuthData(),
  getAuthData: async () =>
    localforage
      .getItem<AuthData>('auth')
      .then((data) => data)
      .catch(() => null),
  setAuthData: async (data: AuthData) => localforage.setItem('auth', data),
  removeAuthData: async () => await localforage.removeItem('auth'),
}
