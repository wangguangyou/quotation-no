import { ReactNode, useEffect, useState } from 'react'
import { useUser } from '@/store/user'
import { useRouter } from 'next/router'
import Image from 'next/image'
import png403 from '@/assets/403.svg'
type Props = {
  children: ReactNode
  noLayout?: boolean
}
const Layout = ({ children, noLayout }: Props) => {
  const user = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!(router.asPath === '/login' || user.id)) {
      router.replace('/login').then(() => {
        setTimeout(() => {
          setLoading(false)
        }, 0)
      })
    } else {
      setLoading(false)
    }
  }, [router, user.id])

  if (user.id) {
    // if (true) {
    //   return (
    //     <div style={{ textAlign: 'center' }}>
    //       <Image
    //         style={{ margin: '12vh auto 0' }}
    //         src={png403}
    //         alt="暂无权限"
    //         width={600}
    //       />
    //       <p style={{ fontSize: '28px' }}>暂无权限</p>
    //     </div>
    //   )
    // }
  }
  if (!loading) {
    return noLayout ? (
      <>{children}</>
    ) : (
      <div>
        <header>header</header>
        <main>{children}</main>
      </div>
    )
  }
  return <></>
}

export default Layout
