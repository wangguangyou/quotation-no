import type { ReactNode } from 'react'
import userState from '@/store/user'
import { useSnapshot } from 'valtio'

interface Props {
  children: ReactNode | ReactNode[]
  auth?: string | string[]
}
const AuthWrap = ({ children, auth }: Props) => {
  const state = useSnapshot(userState)
  if (auth === 'add-no' && !(state.isClerk || state.isAdmin)) {
    return <></>
  }
  if (auth === 'alone-create' && !(state.isClerk || state.isAdmin)) {
    return <></>
  }
  return <>{children}</>
}
export default AuthWrap
