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
import {
  getBadRangePage,
  editBadRange,
  delBadRange,
  addBadRange,
} from '@/api/param'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

type BadRange = unwrapResponse<typeof getBadRangePage>[number]

const Component = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<BadRange>()
  const [data, setData] = useState<BadRange[]>([])
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
    } = await getBadRangePage({
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

  const editRecord = (record: BadRange) => {
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
  const handleDelete = async (record: BadRange) => {
    await delBadRange(record.id)
    init()
  }
  const onFinish = async (values: any) => {
    currentRecord
      ? await editBadRange(currentRecord!.id, values)
      : await addBadRange(values)
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
              title="长"
              dataIndex="minLength"
              key="minLength"
              render={(minLength, record: BadRange) => (
                <div>
                  {minLength}~{record.maxLength}
                </div>
              )}
            />
            <Table.Column
              title="宽"
              dataIndex="minWidth"
              key="minWidth"
              render={(minWidth, record: BadRange) => (
                <div>
                  {minWidth}~{record.maxWidth}
                </div>
              )}
            />
            <Table.Column title="数量" dataIndex="size" key="size" />
            <Table.Column title="不良率(%)" dataIndex="rate" key="rate" />

            <Table.Column
              title="操作"
              key="action"
              width={120}
              render={(_: any, record: BadRange) => (
                <div className="space-x-12">
                  <a onClick={() => editRecord(record)}>修改</a>
                  <Popconfirm
                    title={`确定删除 ${record.minLength}*${record.minWidth}~${record.maxLength}*${record.maxWidth} ?`}
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
          <Form.Item rules={[{ required: true }]}>
            <Form.Item
              label="最小长"
              name="minLength"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
            >
              <InputNumber
                min={0}
                className="w-full"
                autoComplete="off"
                size="large"
              />
            </Form.Item>
            <span className="inline-block text-center w-24 lh-94">~</span>
            <Form.Item
              label="最大长"
              name="maxLength"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
            >
              <InputNumber
                min={0}
                className="w-full"
                autoComplete="off"
                size="large"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item rules={[{ required: true }]}>
            <Form.Item
              label="最小宽"
              name="minWidth"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
            >
              <InputNumber
                min={0}
                className="w-full"
                autoComplete="off"
                size="large"
              />
            </Form.Item>
            <span className="inline-block text-center w-24 lh-94">~</span>
            <Form.Item
              label="最大宽"
              name="maxWidth"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
            >
              <InputNumber
                min={0}
                className="w-full"
                autoComplete="off"
                size="large"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="数量" name="size" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              className="w-full"
              autoComplete="off"
              size="large"
            />
          </Form.Item>
          <Form.Item label="不良率" name="rate" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              max={100}
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
