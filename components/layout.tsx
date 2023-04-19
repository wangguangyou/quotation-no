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
  const state = useSnapshot(userState)
  const onLoginout = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    userState.user = null
    router.replace('/login')
  }
  const onUserInfo = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.replace('/info')
  }
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={onUserInfo}>个人信息</a>,
    },
    {
      key: '2',
      label: <a onClick={onLoginout}>退出登录</a>,
    },
  ]
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (router.asPath === '/login' && state.user) {
      router.replace('/')
    }
    if (router.asPath !== '/login' && !state.user) {
      router.replace('/login')
    } else {
      router.isReady && setLoading(false)
    }
  }, [router, state.user])

  if (state.user) {
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
                {state.user?.username?.charAt(0)}
              </Avatar>
              <div className={styles.headerRightText}>
                {state.user?.nickname}
              </div>
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
          <Content style={{ padding: '24px' }}>{children}</Content>
        </ALayout>
      </ALayout>
    )
  }
  return <></>
}

export default Layout
