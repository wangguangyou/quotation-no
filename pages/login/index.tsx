import type { NextPageWithLayout } from '../_app'
import { Form, Input, Button } from 'antd'
import Granim from 'granim'
import { useEffect, useRef } from 'react'
import userState from '@/store/user'
import { useRouter } from 'next/router'
import { getLogin } from '@/api'

const Login: NextPageWithLayout = () => {
  const [form] = Form.useForm()
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
    const { data } = await getLogin(values)
    userState.user = data
    router.push('/')
  }

  return (
    <>
      <div className="bg-#f1f3f4 h-100vh relative overflow-hidden">
        <canvas className="absoulte h-full w-full" ref={Canvas}></canvas>
        <main className="p-c h-400 w-700 px-30 py-60 bg-white rd-8 shadow-[var(--shadows-login)]">
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
              form={form}
              style={{ maxWidth: 300 }}
            >
              <Form.Item
                label="username"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input size="large" placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item
                label="password"
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
        </main>
      </div>
    </>
  )
}

Login.noLayout = true
export default Login
