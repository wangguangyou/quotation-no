import { Form, Input, Button, Checkbox } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { createUser, editUser } from '@/api'
import { useState } from 'react'
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
  const [editPas, setEditPas] = useState(false)
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
        <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
          <Input
            disabled={!!data}
            autoComplete="off"
            size="large"
            placeholder="请输入用户名"
          />
        </Form.Item>
        <Form.Item label="名称" name="nickname" rules={[{ required: true }]}>
          <Input autoComplete="off" size="large" placeholder="请输入名称" />
        </Form.Item>
        {data && (
          <Checkbox
            onChange={({ target: { checked } }) => setEditPas(checked)}
            className="mb-24"
          >
            修改密码
          </Checkbox>
        )}

        <AnimatePresence>
          {(editPas || !data) && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password
                  autoComplete="new-password"
                  size="large"
                  placeholder="请输入密码"
                />
              </Form.Item>
            </motion.div>
          )}
        </AnimatePresence>

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
