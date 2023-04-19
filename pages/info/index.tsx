import type { NextPageWithLayout } from '../_app'
import { useSnapshot } from 'valtio'
import { Form, Input, Button, Card } from 'antd'
import { useEffect } from 'react'
import userState from '@/store/user'
import { useRouter } from 'next/router'

const Info: NextPageWithLayout = () => {
  const router = useRouter()
  const user = useSnapshot(userState)

  const onFinish = async (values: any) => {
    const { data } = await getLogin(values)
    userState.user = data
    router.push('/')
  }

  return (
    <Card bordered={false}>
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
    </Card>
  )
}

export default Info
