import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Popconfirm,
  Modal,
  InputNumber,
} from 'antd'
import FadeIn from '@/components/FadeIn'
import { getAccyPage, editAccy, delAccy, addAccy } from '@/api/param'
import { useEffect, useState } from 'react'

type Accy = unwrapResponse<typeof getAccyPage>[number]

const Component = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Accy>()
  const [data, setData] = useState<Accy[]>([])
  const [loading, setLoading] = useState(true)

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const onChange = (pagination: any) => {
    setPagination((val) => Object.assign(val, pagination))
    init()
  }

  const init = async (): Promise<any> => {
    setLoading(true)
    const {
      data: { list, total, pageCurrent },
    } = await getAccyPage({
      ...{ size: pagination.pageSize, page: pagination.current },
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

  useEffect(() => {
    init()
  }, [])

  const editRecord = (record: Accy) => {
    setCurrentRecord(record)
    setIsModalOpen(true)
  }
  const addRecord = () => {
    setCurrentRecord(undefined)
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleDelete = async (record: Accy) => {
    await delAccy(record.id)
    init()
  }
  const onFinish = async (values: any) => {
    currentRecord
      ? await editAccy(currentRecord!.id, values)
      : await addAccy(values)
    setIsModalOpen(false)
    init()
  }

  return (
    <>
      <FadeIn>
        <Card className="mt-24" bordered={false}>
          <div className="mb-16">
            <Button onClick={addRecord} type="primary">
              新增
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
            <Table.Column
              title="产品名称"
              dataIndex="accyName"
              key="accyName"
            />

            <Table.Column
              title="操作"
              key="action"
              width={120}
              render={(_: any, record: Accy) => (
                <div className="space-x-12">
                  <a onClick={() => editRecord(record)}>修改</a>
                  <Popconfirm
                    title={`确定删除 ${record.accyName}?`}
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
        title={currentRecord ? '修改' : '新增'}
        destroyOnClose
        open={isModalOpen}
        footer={null}
        centered
        width={380}
        onCancel={handleCancel}
      >
        <Form
          autoComplete="off"
          initialValues={currentRecord ? currentRecord : {}}
          onFinish={onFinish}
          className="mt-30 text-left mx-a"
          layout="vertical"
          style={{ maxWidth: 300 }}
        >
          <div className="mt-40"></div>
          <Form.Item
            label="产品名称"
            name="accyName"
            rules={[{ required: true }]}
          >
            <Input className="w-full" autoComplete="off" size="large" />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" block type="primary">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Component
