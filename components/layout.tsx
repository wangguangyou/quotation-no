import { ReactNode, useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import userState from '@/store/user'
import { useRouter } from 'next/router'
import { Layout as ALayout, Menu, Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import styles from '@/styles/Layout.module.css'
const { Header, Sider, Content } = ALayout
import Image from 'next/image'
import png403 from '@/assets/403.svg'
import { useSnapshot } from 'valtio'
type Props = {
  children: ReactNode
  noLayout?: boolean
}
const Layout = ({ children, noLayout }: Props) => {
  const onLoginout = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    userState.user = {}
    router.replace('/login')
  }
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={onLoginout}>退出登录</a>,
    },
  ]
  const user = useSnapshot(userState.user)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!(router.asPath === '/login' || user.token)) {
      router.replace('/login').then(() => {
        setTimeout(() => {
          setLoading(false)
        }, 0)
      })
    } else {
      setLoading(false)
    }
  }, [router, user.token])

  if (user.token) {
    if (false) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Image
            style={{ margin: '12vh auto 0' }}
            src={png403}
            alt="暂无权限"
            width={600}
          />
          <p style={{ fontSize: '28px' }}>暂无权限</p>
        </div>
      )
    }
  }
  if (!loading) {
    return noLayout ? (
      <>{children}</>
    ) : (
      <ALayout style={{ minHeight: '100vh' }}>
        <Header className={styles.header}>
          <div className={styles.headerTitle}>宁波品印智能报价软件</div>
          <Dropdown menu={{ items }}>
            <div className={styles.headerRight}>
              <Avatar className={styles.headerRightAvatar}>
                {user.username?.charAt(0)}
              </Avatar>
              <div className={styles.headerRightText}>{user.nickname}</div>
            </div>
          </Dropdown>
        </Header>
        <ALayout>
          <Sider theme="light" style={{ paddingTop: '1em' }}>
            <Menu
              style={{ height: '100%', borderRight: 0 }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              items={userState.showMenu}
            />
          </Sider>
          <Content>{children}</Content>
        </ALayout>
      </ALayout>
    )
  }
  return <></>
}

export default Layout
