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
import { getFixedParam, editFixedParam } from '@/api/param'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

type Fixed = unwrapResponse<typeof getFixedParam>[number]

const Component = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Fixed>()
  const [data, setData] = useState<Fixed[]>([])
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

  const init = async (query?: any) => {
    setLoading(true)
    const { data } = await getFixedParam({
      ...query,
    })
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  const editRecord = (record: Fixed) => {
    setCurrentRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onFinish = async (values: any) => {
    await editFixedParam(currentRecord!.id, values)
    init()
    setIsModalOpen(false)
  }

  return (
    <>
      <FadeIn>
        <Card className="mt-24" bordered={false}>
          <Table
            onChange={onChange}
            pagination={false}
            bordered
            rowKey="id"
            loading={loading}
            dataSource={data}
          >
            <Table.Column title="名称" dataIndex="valueName" key="valueName" />
            <Table.Column title="价格" dataIndex="value" key="value" />

            <Table.Column
              title="创建时间"
              dataIndex="createTime"
              key="createTime"
              render={(createTime) => (
                <div>{dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
              )}
            />

            <Table.Column
              title="最后更新时间"
              dataIndex="updateTime"
              key="updateTime"
              render={(updateTime) => (
                <div>{dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
              )}
            />

            <Table.Column
              title="操作"
              key="action"
              width={80}
              render={(_: any, record: Fixed) => (
                <div className="space-x-12">
                  <a onClick={() => editRecord(record)}>修改</a>
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
          initialValues={{ newValue: currentRecord?.value }}
          onFinish={onFinish}
          className="mt-30 text-left mx-a"
          layout="vertical"
          style={{ maxWidth: 300 }}
        >
          <div className="mt-40"></div>
          <Form.Item label="价格" name="newValue" rules={[{ required: true }]}>
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
