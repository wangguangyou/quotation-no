import type { NextPage } from 'next'
import type { Role } from '@/types'
import { Card, Form, Input, Button, Table, Tag, Popconfirm, Modal } from 'antd'
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

interface DataType {
  id: number
  username: string
  nickname: string
  createTime: string
  isDelete: boolean
  roleList: _Role[]
}
interface _Role {
  id: number
  roleName: string
  createTime: string
  userId: number
}
const User: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<DataType>()
  const [data, setData] = useState<DataType[]>([])
  const [allRoleList, setRoleList] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState({ name: '' })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const onFinish = (values: any) => {
    setPagination((val) => Object.assign(val, { current: 1 }))
    init(values)
  }
  const handleDelete = async (record: DataType) => {
    await delUser(record.id)
    init()
  }
  const onChange = (pagination: any) => {
    setPagination((val) => Object.assign(val, pagination))
    init()
  }
  const onRoleChange = async (
    id: number,
    checked: boolean,
    record: DataType
  ) => {
    checked
      ? await roleRlUser(id, { userId: record.id })
      : await delRoleRlUser(id, { userId: record.id })
    init()
  }
  const init = async (query?: any) => {
    setLoading(true)
    const {
      data: { list, total },
    } = await getUserList({
      ...{ size: pagination.pageSize, page: pagination.current },
      ...query,
    })
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
  const editUser = (record: DataType) => {
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
              render={(roleList, record: DataType) => (
                <>
                  {allRoleList.map(({ id, roleName }) => (
                    <Tag.CheckableTag
                      checked={!!roleList?.find((find: Role) => find.id === id)}
                      onChange={(checked) => onRoleChange(id, checked, record)}
                      key={id}
                    >
                      {roleName}
                    </Tag.CheckableTag>
                  ))}
                </>
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
              render={(_: any, record: DataType) => (
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
export default User
