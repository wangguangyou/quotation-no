import type { NextPage } from 'next'
import { Card, Form, Input, Button, Table, Tag, Popconfirm, Modal } from 'antd'
import MainForm from '@/components/MainForm'
import FadeIn from '@/components/FadeIn'
import AuthWrap from '@/components/AuthWrap'
import {
  getUserList,
  getRoleList,
  roleRlUser,
  delUser,
  delRoleRlUser,
} from '@/api'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

type User = unwrapResponse<typeof getUserList>[number]
type Role = unwrapResponse<typeof getRoleList>[number]

const UserPage: NextPage = () => {
  const router = useRouter()
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
    setPagination((val) => Object.assign(val, { current: 1 }))
    init(values)
  }
  const handleDelete = async (record: User) => {
    await delUser(record.id)
    init()
  }
  const onChange = (pagination: any) => {
    setPagination((val) => Object.assign(val, pagination))
    init()
  }
  const onRoleChange = async (id: number, checked: boolean, record: User) => {
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

  const onAdd = () => {
    router.push('/no')
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
          <AuthWrap auth="add-no">
            <div className="mb-16">
              <Button onClick={onAdd} type="primary">
                新增报价
              </Button>
            </div>
          </AuthWrap>
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
              render={(_: any, record: User) => (
                <div className="space-x-12">
                  <AuthWrap auth="edit-no">
                    <a onClick={() => editUser(record)}>修改</a>
                  </AuthWrap>
                  <AuthWrap auth="del-no">
                    <Popconfirm
                      title={`确定删除 ${record.username} ?`}
                      onConfirm={() => handleDelete(record)}
                    >
                      <a>删除</a>
                    </Popconfirm>
                  </AuthWrap>
                </div>
              )}
            />
          </Table>
        </Card>
      </FadeIn>
      <Modal
        destroyOnClose
        open={isModalOpen}
        footer={null}
        centered
        width={'80%'}
        onCancel={handleCancel}
      >
        <h1 className="mt-0">修改报价单</h1>
        <div className="overflow-y-auto max-h-80vh">
          <MainForm data={currentUser}></MainForm>
        </div>
      </Modal>
    </>
  )
}
export default UserPage
