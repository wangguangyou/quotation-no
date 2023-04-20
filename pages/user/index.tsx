import type { NextPage } from 'next'
import { Card, Form, Input, Button, Table, Tag, Popconfirm } from 'antd'
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
  roleList: Role[]
}
interface Role {
  id: number
  roleName: string
  createTime: string
  userId: number
}

const User: NextPage = () => {
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
    setQuery(values)
    init()
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
    ;(await checked)
      ? roleRlUser(id, { userId: record.id })
      : delRoleRlUser(id, { userId: record.id })
    init()
  }
  const init = async () => {
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
    const { data } = await getRoleList({})
    setRoleList(data)
  }
  useEffect(() => {
    initRoleList()
    init()
  }, [])
  return (
    <>
      <Card bordered={false}>
        <Form layout="inline" onFinish={onFinish} autoComplete="off">
          <Form.Item label="用户名" name="name">
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
          <Button type="primary">新增用户</Button>
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
            render={(_: any, record: DataType) => (
              <div className="space-x-12">
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
    </>
  )
}
export default User
