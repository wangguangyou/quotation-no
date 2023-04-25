import type { ReactNode } from 'react'
import userState from '@/store/user'
import { useSnapshot } from 'valtio'

interface Props {
  children: ReactNode | ReactNode[]
  auth?: string | string[]
}
const AuthWrap = ({ children, auth }: Props) => {
  const state = useSnapshot(userState)

  return <>{children}</>
}
export default AuthWrap
