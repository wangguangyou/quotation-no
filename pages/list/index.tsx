import type { NextPage } from 'next'
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Descriptions,
  Popconfirm,
  Modal,
  Select,
  Badge,
} from 'antd'
import type { BadgeProps } from 'antd'
import MainForm from '@/components/MainForm'
import FadeIn from '@/components/FadeIn'
import AuthWrap from '@/components/AuthWrap'
import { getQuotationPage, delQuotation } from '@/api/quotation'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import dataState from '@/store/data'
import { useSnapshot } from 'valtio'

type Quotation = unwrapResponse<typeof getQuotationPage>[number]

const Page: NextPage = () => {
  const state = useSnapshot(dataState)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Quotation | undefined>(
    undefined
  )
  const [data, setData] = useState<Quotation[]>()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState({})
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const onFinish = (values: any) => {
    const { status } = values
    values.complete = false
    if (status === 100) {
      values = { ...values, status: 10, complete: true }
    }
    setQuery((val) => Object.assign(val, values))
    setPagination((val) => Object.assign(val, { current: 1 }))
    init()
  }
  const handleDelete = async (record: Quotation) => {
    await delQuotation(record.id)
    init()
  }
  const onChange = (pagination: any) => {
    setPagination((val) => Object.assign(val, pagination))
    init()
  }
  const init = async (): Promise<any> => {
    setLoading(true)
    const {
      data: { list, total, pageCurrent },
    } = await getQuotationPage({
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
  const getBadgeStatus = (record: Quotation) => {
    const { quotedStatus } = record
    return ({ 21: 'warning', 20: 'warning', 30: 'success' }[
      String(quotedStatus)
    ] || 'processing') as BadgeProps['status']
  }
  useEffect(() => {
    init()
  }, [])

  const onAdd = () => {
    router.push('/no')
  }
  const editRecord = (record: Quotation) => {
    setCurrentRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onAction = () => {
    init()
    setIsModalOpen(false)
  }

  const expandedRowRender = (record: Quotation, index: number) => {
    return (
      <Descriptions className="pt-16 w-400" column={2}>
        <Descriptions.Item label="创建时间">
          {dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="经理">{record.manager}</Descriptions.Item>
      </Descriptions>
    )
  }
  return (
    <>
      <FadeIn>
        <Card bordered={false}>
          <Form layout="inline" onFinish={onFinish} autoComplete="off">
            <Form.Item label="业务员" name="clerk">
              <Input allowClear />
            </Form.Item>
            <Form.Item label="采购员" name="buyer">
              <Input allowClear />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select
                allowClear
                className="w-183!"
                options={state.statusList as any}
              />
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
          {
            <Table
              expandable={{
                expandedRowRender,
                defaultExpandAllRows: false,
              }}
              onChange={onChange}
              pagination={pagination}
              bordered
              rowKey="id"
              loading={loading}
              dataSource={data}
            >
              <Table.Column
                title="尺寸"
                dataIndex="length"
                key="length"
                render={(length, record: Quotation) =>
                  `${length}*${record.width}*${record.height}`
                }
              />
              <Table.Column title="数量" dataIndex="size" key="size" />
              <Table.Column
                title="状态"
                dataIndex="quotedStatus"
                key="quotedStatus"
                render={(quotedStatus, record: Quotation) => {
                  return (
                    <Badge
                      status={getBadgeStatus(record)}
                      text={state.getLabel(
                        record.buyer && quotedStatus === 10 ? 100 : quotedStatus
                      )}
                    />
                  )
                }}
              />
              <Table.Column title="业务员" dataIndex="clerk" key="clerk" />
              <Table.Column title="采购员" dataIndex="buyer" key="buyer" />

              <Table.Column
                title="成本价格"
                dataIndex="costPrice"
                key="costPrice"
              />
              <Table.Column
                title="税后价格"
                dataIndex="taxPrice"
                key="taxPrice"
              />
              <Table.Column title="利润" dataIndex="profit" key="profit" />
              <Table.Column
                title="利润率"
                dataIndex="profitPercentage"
                key="profitPercentage"
              />
              <Table.Column
                fixed={true}
                title="最终价格"
                dataIndex="quotedPrice"
                key="quotedPrice"
              />
              <Table.Column
                title="操作"
                key="action"
                width={120}
                render={(_: any, record: Quotation) => (
                  <div className="space-x-12">
                    <AuthWrap auth="edit-no">
                      <a onClick={() => editRecord(record)}>修改</a>
                    </AuthWrap>
                    <AuthWrap auth="del-no">
                      <Popconfirm
                        title={`确定删除?`}
                        onConfirm={() => handleDelete(record)}
                      >
                        <a>删除</a>
                      </Popconfirm>
                    </AuthWrap>
                  </div>
                )}
              />
            </Table>
          }
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
          <MainForm data={currentRecord}></MainForm>
        </div>
      </Modal>
    </>
  )
}
export default Page
