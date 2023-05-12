import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Popconfirm,
  Modal,
  InputNumber,
  Select,
} from 'antd'
import FadeIn from '@/components/FadeIn'
import { useSnapshot } from 'valtio'
import dataState from '@/store/data'
import { getWeightPage, editWeight, delWeight, addWeight } from '@/api/param'
import { useEffect, useState } from 'react'
import type { Store as DataStoreType } from '@/store/data'

type Mt = unwrapResponse<typeof getWeightPage>[number]

const Component = () => {
  const hotDataState = useSnapshot(dataState)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Mt>()
  const [data, setData] = useState<Mt[]>([])
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<DataStoreType['options']>()

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
    } = await getWeightPage({
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
    ;(async () => {
      setOptions(await hotDataState.initOptions())
    })()
  }, [])

  const editRecord = (record: Mt) => {
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
  const handleDelete = async (record: Mt) => {
    await delWeight(record.id)
    init()
  }
  const onFinish = async (values: any) => {
    currentRecord
      ? await editWeight(currentRecord!.id, values)
      : await addWeight(values)
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
            <Table.Column title="面料" dataIndex="mtName" key="mtName" />
            <Table.Column title="底料" dataIndex="prName" key="prName" />
            <Table.Column title="厚(mm)" dataIndex="height" key="height" />
            <Table.Column title="每平方克重" dataIndex="weight" key="weight" />

            <Table.Column
              title="操作"
              key="action"
              width={120}
              render={(_: any, record: Mt) => (
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

          <Form.Item label="面料" name="mtId" rules={[{ required: true }]}>
            <Select
              placeholder="请选择"
              className="w-full!"
              options={options?.mt}
            />
          </Form.Item>
          <Form.Item label="底料" name="prId" rules={[{ required: true }]}>
            <Select
              placeholder="请选择"
              className="w-full!"
              options={options?.pr}
            />
          </Form.Item>

          <Form.Item label="厚(mm)" name="height" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              className="w-full"
              autoComplete="off"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="每平方克重"
            name="weight"
            rules={[{ required: true }]}
          >
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
