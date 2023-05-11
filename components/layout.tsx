import { ReactNode, useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import userState from '@/store/user'
import { usePathname, useRouter } from 'next/navigation'
import { Layout as ALayout, Menu, Avatar, Dropdown, Button, Space } from 'antd'
import type { MenuProps } from 'antd'
import styles from '@/styles/Layout.module.css'
const { Header, Sider, Content, Footer } = ALayout
import Image from 'next/image'
import png403 from '@/assets/403.svg'
import { useSnapshot } from 'valtio'

type Props = {
  children: ReactNode
  noLayout?: boolean
}
export const MyFooter = ({ style }: { style: React.CSSProperties }) => {
  return (
    <Footer
      style={{
        textAlign: 'center',
        color: '#aaa',
        background: 'transparent',
        ...style,
      }}
    >
      <Space>
        <span>技术支持：浙江晨阳软件</span>
        <span>联系电话：13454713815</span>
        <span>当前版本：V1.0.1</span>
      </Space>
    </Footer>
  )
}
const Layout = ({ children, noLayout }: Props) => {
  const state = useSnapshot(userState)
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const onLoginout = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/login')
    userState.user = null
  }

  // const onUserInfo = (event: MouseEvent<HTMLAnchorElement>) => {
  //   event.preventDefault()
  //   router.replace('/info')
  // }
  const onMenuSelect: MenuProps['onSelect'] = ({ key }) => {
    router.push(key)
  }
  const items: MenuProps['items'] = [
    // {
    //   key: '1',
    //   label: <a onClick={onUserInfo}>个人信息</a>,
    // },
    {
      key: '2',
      label: <a onClick={onLoginout}>退出登录</a>,
    },
  ]

  useEffect(() => {
    if (pathname === '/login' && state.user) {
      const key = userState.showMenu[0]?.key
      key && router.replace(key)
    }
    if (pathname !== '/login' && !state.user) {
      router.replace('/login')
    } else {
      setLoading(false)
    }
  }, [router, state.user])

  if (!loading) {
    const pageCode = state.getCurrentPageCode(pathname)

    if (state.user && pageCode && !state.openPage.includes(pathname)) {
      if (!state.user.rlPages.find((find) => find.pageCode === pageCode)) {
        return (
          <>
            <div style={{ textAlign: 'center' }}>
              <Image
                style={{ margin: '12vh auto 0' }}
                src={png403}
                alt="暂无权限"
                width={600}
              />
              <p style={{ fontSize: '28px' }}>暂无权限</p>
              <Button
                onClick={() => router.back()}
                style={{ width: '300px', marginTop: '40px' }}
                size="large"
                shape="round"
                type="primary"
              >
                返回
              </Button>
            </div>
          </>
        )
      }
    }

    return noLayout ? (
      <>{children}</>
    ) : (
      <ALayout style={{ minHeight: '100vh' }}>
        <Header className={styles.header}>
          <div className={styles.headerTitle}>
            <Image
              src="/quotation-web/logo-white.svg"
              alt="Logo"
              width={60}
              height={40}
              priority
            />
            宁波品印智能报价软件
          </div>
          {state.user && (
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
          )}
        </Header>
        <ALayout>
          <Sider theme="light" style={{ paddingTop: '1em' }}>
            <Menu
              onSelect={onMenuSelect}
              style={{ height: '100%', borderRight: 0 }}
              selectedKeys={[pathname]}
              openKeys={[]}
              items={userState.showMenu}
            />
          </Sider>
          <ALayout>
            <Content style={{ padding: '24px 24px 0' }}>{children}</Content>
            <MyFooter></MyFooter>
          </ALayout>
        </ALayout>
      </ALayout>
    )
  }
  return <></>
}

export default Layout
