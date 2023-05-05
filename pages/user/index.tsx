import type { NextPage } from 'next'
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Radio,
  Popconfirm,
  Modal,
} from 'antd'
import UserForm from '@/components/user/form'
import FadeIn from '@/components/FadeIn'
import {
  getUserList,
  getRoleList,
  roleRlUser,
  delUser,
  delRoleRlUser,
} from '@/api'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

type User = unwrapResponse<typeof getUserList>[number]
type Role = unwrapResponse<typeof getRoleList>[number]

const UserPage: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>()
  const [data, setData] = useState<User[]>([])
  const [allRoleList, setRoleList] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState({ name: '' })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const onFinish = (values: any) => {
    setQuery((val) => Object.assign(val, values))
    setPagination((val) => Object.assign(val, { current: 1 }))
    init()
  }
  const handleDelete = async (record: User) => {
    await delUser(record.id)
    init()
  }
  const onChange = (pagination: any) => {
    setPagination((val) => Object.assign(val, pagination))
    init()
  }
  // const onRoleChange = async (id: number, checked: boolean, record: User) => {
  //   checked
  //     ? await roleRlUser(id, { userId: record.id })
  //     : await delRoleRlUser(id, { userId: record.id })
  //   init()
  // }
  const onRoleChange = async (id: number, record: User) => {
    record.roleList[0]?.id &&
      (await delRoleRlUser(record.roleList[0]?.id, { userId: record.id }))

    await roleRlUser(id, { userId: record.id })
    init()
  }
  const init = async (): Promise<any> => {
    setLoading(true)
    const {
      data: { list, total, pageCurrent },
    } = await getUserList({
      ...{ size: pagination.pageSize, page: pagination.current },
      ...query,
    })
    if (pageCurrent !== 1 && !list.length) {
      setPagination((val) => Object.assign(val, { current: 1 }))
      return init()
    }
    setPagination({
      ...pagination,
      total,
    })
    setData(list)
    setLoading(false)
  }
  const initRoleList = async () => {
    const { data } = await getRoleList()
    setRoleList(data)
  }
  useEffect(() => {
    initRoleList()
    init()
  }, [])

  const addUser = () => {
    setCurrentUser(undefined)
    setIsModalOpen(true)
  }
  const editUser = (record: User) => {
    setCurrentUser(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onAction = () => {
    init()
    setIsModalOpen(false)
  }
  return (
    <>
      <FadeIn>
        <Card bordered={false}>
          <Form layout="inline" onFinish={onFinish} autoComplete="off">
            <Form.Item label="关键字" name="name">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card className="mt-24" bordered={false}>
          <div className="mb-16">
            <Button onClick={addUser} type="primary">
              新增用户
            </Button>
          </div>

          <Table
            onChange={onChange}
            pagination={pagination}
            bordered
            rowKey="id"
            loading={loading}
            dataSource={data}
          >
            <Table.Column title="用户名" dataIndex="username" key="username" />
            <Table.Column title="名称" dataIndex="nickname" key="nickname" />
            <Table.Column
              render={(roleList, record: User) => (
                <Radio.Group
                  onChange={({ target: { value } }) =>
                    onRoleChange(value, record)
                  }
                  value={roleList[0]?.id}
                >
                  {allRoleList.map(({ id, roleName }) => (
                    <Radio key={id} value={id}>
                      {roleName}
                    </Radio>
                  ))}
                </Radio.Group>
              )}
              title="角色"
              dataIndex="roleList"
              key="roleList"
            />
            <Table.Column
              title="创建时间"
              dataIndex="createTime"
              key="createTime"
              render={(createTime) => (
                <div>{dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
              )}
            />

            <Table.Column
              title="操作"
              key="action"
              width={120}
              render={(_: any, record: User) => (
                <div className="space-x-12">
                  <a onClick={() => editUser(record)}>修改</a>
                  <Popconfirm
                    title={`确定删除 ${record.username} ?`}
                    onConfirm={() => handleDelete(record)}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
        </Card>
      </FadeIn>
      <Modal
        title={currentUser ? '修改用户' : '新增用户'}
        destroyOnClose
        open={isModalOpen}
        footer={null}
        centered
        width={380}
        onCancel={handleCancel}
      >
        <UserForm data={currentUser} onSubmit={onAction}></UserForm>
      </Modal>
    </>
  )
}
export default UserPage
