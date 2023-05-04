import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Popconfirm,
  Modal,
  InputNumber,
} from 'antd'
import FadeIn from '@/components/FadeIn'
import { getLCPPage, editLCP, delLCP, addLCP } from '@/api/param'
import { useEffect, useState } from 'react'

type LCP = unwrapResponse<typeof getLCPPage>[number]

const Component = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<LCP>()
  const [data, setData] = useState<LCP[]>([])
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
    } = await getLCPPage({
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

  const editRecord = (record: LCP) => {
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
  const handleDelete = async (record: LCP) => {
    await delLCP(record.id)
    init()
  }
  const onFinish = async (values: any) => {
    currentRecord
      ? await editLCP(currentRecord!.id, values)
      : await addLCP(values)
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
            <Table.Column title="长" dataIndex="length" key="length" />
            <Table.Column title="宽" dataIndex="width" key="width" />
            <Table.Column title="数量" dataIndex="size" key="size" />

            <Table.Column title="单价(元)" dataIndex="price" key="price" />
            <Table.Column
              title="操作"
              key="action"
              width={120}
              render={(_: any, record: LCP) => (
                <div className="space-x-12">
                  <a onClick={() => editRecord(record)}>修改</a>
                  <Popconfirm
                    title={`确定删除?`}
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
          <Form.Item label="长" name="length" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              className="w-full"
              autoComplete="off"
              size="large"
            />
          </Form.Item>
          <Form.Item label="宽" name="width" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              className="w-full"
              autoComplete="off"
              size="large"
            />
          </Form.Item>
          <Form.Item label="数量" name="size" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              className="w-full"
              autoComplete="off"
              size="large"
            />
          </Form.Item>
          <Form.Item label="单价(元)" name="price" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              className="w-full"
              autoComplete="off"
              size="large"
            />
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
