import Image from 'next/image'
import type { NextPageWithLayout } from '../_app'
import { Form, Input, Button } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { MyFooter } from '@/components/layout'
import Gradient from '@/components/Gradient'
import { useState } from 'react'
import userState from '@/store/user'
import { useRouter, usePathname } from 'next/navigation'
import { getLogin } from '@/api'
import { useSnapshot } from 'valtio'
process.env
const Login: NextPageWithLayout = () => {
  const state = useSnapshot(userState)
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const onFinish = async (values: any) => {
    // setIsVisible(false)
    setLoading(true)
    try {
      const { data } = await getLogin(values)
      userState.user = data
      router.push(state.showMenu[0]?.key || '/')
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  const style: React.CSSProperties = {
    color: '#fff',
  }

  return (
    <div className="bg-#f1f3f4 h-100vh relative overflow-hidden">
      <div className="absolute h-full w-full">
        <Gradient />
        <div className="absolute bottom-0 left-0 right-0">
          <MyFooter style={style}></MyFooter>
        </div>
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={pathname}
            transition={{ delay: 0.4 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: '-51%', x: '-51%', scale: 0.8 }}
            animate={{ opacity: 1, y: '-50%', x: '-50%', scale: 1 }}
            className="p-c h-440 w-700 px-30 py-60 bg-white rd-8 shadow-[var(--shadows-login)]"
          >
            <div className="w-300 text-center mx-auto">
              <Image
                src="/quotation-web/logo.svg"
                alt="Logo"
                width={100}
                height={60}
                priority
              />
              <h1 className="fw-600 text-24">Sign in</h1>
              <h2 className="lh-20 text-14 text-#999">
                欢迎登录
                <br />
                宁波品印智能报价软件
              </h2>
              <Form
                onFinish={onFinish}
                className="mt-30 text-left"
                layout="vertical"
                style={{ maxWidth: 300 }}
              >
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                  label="密码"
                  name="password"
                  rules={[{ required: true }]}
                >
                  <Input.Password size="large" placeholder="请输入密码" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loading}
                    htmlType="submit"
                    block
                    type="primary"
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Login.noLayout = true
export default Login
