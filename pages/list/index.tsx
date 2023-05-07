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
} from 'antd'
import MainForm from '@/components/MainForm'
import Detail from '@/components/no/Detail'
import FadeIn from '@/components/FadeIn'
import AuthWrap from '@/components/AuthWrap'
import {
  getQuotationPage,
  delQuotation,
  setQuotationStatus,
} from '@/api/quotation'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import dataState from '@/store/data'
import userState from '@/store/user'
import { useSnapshot } from 'valtio'
import Status from '@/components/no/Status'

type Quotation = unwrapResponse<typeof getQuotationPage>[number]

const Page: NextPage = () => {
  const state = useSnapshot(dataState)
  const currentUserState = useSnapshot(userState)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewVisible, setViewVisible] = useState(false)
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

  const rePut = async (record: Quotation) => {
    await setQuotationStatus(record.id, { newStatus: 1 })
  }
  const handleReject = async (record: Quotation) => {
    await setQuotationStatus(record.id, { newStatus: record.buyer ? 20 : 21 })
  }

  const expandedRowRender = (record: Quotation, index: number) => {
    return (
      <Descriptions className="pt-16 " column={5}>
        <Descriptions.Item label="经理">{record.manager}</Descriptions.Item>
        <Descriptions.Item label="客户信息">
          {record.customerInfo}
        </Descriptions.Item>
        <Descriptions.Item label="客户精准定位">
          {record.customerPosition}
        </Descriptions.Item>
        <Descriptions.Item label="客户价格">
          {record.customerPrice}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
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
              scroll={{ x: 'max-content' }}
              expandable={{
                expandedRowRender,
                defaultExpandAllRows: false,
              }}
              onChange={onChange}
              pagination={{
                ...pagination,
                showTotal: (total) => `共${total}条`,
              }}
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
                  return <Status record={record}></Status>
                }}
              />
              <Table.Column title="业务员" dataIndex="clerk" key="clerk" />
              <Table.Column title="采购员" dataIndex="buyer" key="buyer" />

              <Table.Column
                title="成本价格"
                dataIndex="costPrice"
                key="costPrice"
                render={(costPrice) => costPrice.toFixed(2)}
              />
              <Table.Column
                title="税后价格"
                dataIndex="taxPrice"
                key="taxPrice"
                render={(taxPrice) => taxPrice.toFixed(2)}
              />
              <Table.Column title="利润" dataIndex="profit" key="profit" />
              <Table.Column
                title="利润率"
                dataIndex="profitPercentage"
                key="profitPercentage"
              />
              <Table.Column
                fixed={'right'}
                title="最终价格"
                dataIndex="quotedPrice"
                key="quotedPrice"
                render={(quotedPrice) => quotedPrice.toFixed(2)}
              />
              <Table.Column
                fixed={'right'}
                title="操作"
                key="action"
                width={160}
                render={(_: any, record: Quotation) => (
                  <>
                    <Button
                      onClick={() => (
                        setCurrentRecord(record), setViewVisible(true)
                      )}
                      size="small"
                      type="link"
                    >
                      详情
                    </Button>
                    {[0, 10, 11].includes(record.quotedStatus) &&
                      record.buyer && (
                        <AuthWrap auth="input-profit">
                          <Button size="small" type="link">
                            填写利润
                          </Button>
                        </AuthWrap>
                      )}
                    {![30].includes(record.quotedStatus) && (
                      <AuthWrap auth="edit-no">
                        <Button
                          size="small"
                          type="link"
                          onClick={() => editRecord(record)}
                        >
                          修改
                        </Button>
                      </AuthWrap>
                    )}
                    {[20, 21].includes(record.quotedStatus) && (
                      <AuthWrap auth="edit-no">
                        <Popconfirm
                          title={`确定重新提交?`}
                          onConfirm={() => rePut(record)}
                        >
                          <Button size="small" type="link">
                            重新提交
                          </Button>
                        </Popconfirm>
                      </AuthWrap>
                    )}

                    {![20, 21].includes(record.quotedStatus) && (
                      <AuthWrap auth="reject">
                        <Popconfirm
                          title={`确定驳回?`}
                          onConfirm={() => handleReject(record)}
                        >
                          <Button size="small" type="link">
                            驳回
                          </Button>
                        </Popconfirm>
                      </AuthWrap>
                    )}

                    {(currentUserState.isAdmin ||
                      [20, 21].includes(record.quotedStatus)) && (
                      <Popconfirm
                        title={`确定删除?`}
                        onConfirm={() => handleDelete(record)}
                      >
                        <Button size="small" type="link">
                          删除
                        </Button>
                      </Popconfirm>
                    )}
                  </>
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
        width={'82%'}
        onCancel={() => setIsModalOpen(false)}
      >
        <h1 className="mt-0">修改报价单</h1>
        <div className="overflow-y-auto max-h-80vh">
          <MainForm data={currentRecord}></MainForm>
        </div>
      </Modal>

      <Modal
        destroyOnClose
        open={viewVisible}
        footer={null}
        centered
        width={'82%'}
        onCancel={() => setViewVisible(false)}
      >
        <h1 className="mt-0">报价单详情</h1>
        <div className="overflow-y-auto max-h-80vh">
          {currentRecord && <Detail data={currentRecord}></Detail>}
        </div>
      </Modal>
    </>
  )
}
export default Page
