import type { NextPageWithLayout } from '../_app'
import { Form, Input, Button } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import Granim from 'granim'
import { useEffect, useRef, useState } from 'react'
import userState from '@/store/user'
import { useRouter } from 'next/router'
import { getLogin } from '@/api'
import { usePathname } from 'next/navigation'

const Login: NextPageWithLayout = () => {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()
  const Canvas = useRef(null)
  const router = useRouter()
  useEffect(() => {
    new Granim({
      element: Canvas.current,
      name: 'granim',
      direction: 'left-right',
      opacity: [1, 0.1],
      states: {
        'default-state': {
          gradients: [
            ['rgba(255,255,255,.4)', 'rgba(0, 0, 0, .4)'],
            ['rgba(36, 198, 220, .4)', 'rgba(81, 74, 157, .4)'],
            ['rgba(9,90,155,.4)', 'rgba(14,141,159,.4)'],
          ],
        },
      },
    })
  })
  const onFinish = async (values: any) => {
    // setIsVisible(false)
    const { data } = await getLogin(values)
    userState.user = data
    router.push('/')
  }

  return (
    <div className="bg-#f1f3f4 h-100vh relative overflow-hidden">
      <canvas className="absoulte h-full w-full" ref={Canvas}></canvas>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={pathname}
            transition={{ delay: 0.4 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: '-51%', x: '-51%', scale: 0.8 }}
            animate={{ opacity: 1, y: '-50%', x: '-50%', scale: 1 }}
            className="p-c h-400 w-700 px-30 py-60 bg-white rd-8 shadow-[var(--shadows-login)]"
          >
            <div className="w-300 text-center mx-auto">
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
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input size="large" placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                  label="密码"
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password size="large" placeholder="请输入密码" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" block type="primary">
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
