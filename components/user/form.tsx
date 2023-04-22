import { Form, Input, Button } from 'antd'
import { createUser, editUser } from '@/api'
type Data = {
  id: number
  username: string
  nickname: string
  password?: string
}
const UserForm = ({
  onSubmit,
  data,
}: {
  data?: Data
  onSubmit?: () => void
}) => {
  const onFinish = async (values: any) => {
    data ? await editUser(data.id, values) : await createUser(values)
    onSubmit?.()
  }

  return (
    <>
      <Form
        autoComplete="off"
        initialValues={data}
        onFinish={onFinish}
        className="mt-30 text-left mx-a"
        layout="vertical"
        style={{ maxWidth: 300 }}
      >
        <div className="mt-40"></div>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            disabled={!!data}
            autoComplete="off"
            size="large"
            placeholder="请输入用户名"
          />
        </Form.Item>
        <Form.Item
          label="名称"
          name="nickname"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input autoComplete="off" size="large" placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password
            autoComplete="new-password"
            size="large"
            placeholder="请输入密码"
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" block type="primary">
            确定
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default UserForm
