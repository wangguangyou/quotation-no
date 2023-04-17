import type { NextPageWithLayout } from '../_app'
import { Form, Input, Button } from 'antd'
import Granim from 'granim'
import { useEffect, useRef } from 'react'
const Login: NextPageWithLayout = () => {
  const [form] = Form.useForm()
  const Canvas = useRef(null)
  useEffect(() => {
    new Granim({
      element: Canvas.current,
      name: 'granim',
      direction: 'left-right',
      opacity: [1, 0.1],
      states: {
        'default-state': {
          gradients: [
            ['#24C6DC', 'rgba(81, 74, 157, 1)'],
            ['rgb(9,90,155)', 'rgb(14,141,159)'],
          ],
        },
      },
    })
  })
  return (
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
            className="mt-30"
            layout="vertical"
            form={form}
            style={{ maxWidth: 300 }}
          >
            <Form.Item label="account">
              <Input size="large" placeholder="请输入账号" />
            </Form.Item>
            <Form.Item label="password">
              <Input size="large" placeholder="请输入密码" />
            </Form.Item>
            <Form.Item>
              <Button block type="primary">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </div>
  )
}

Login.noLayout = true
export default Login
