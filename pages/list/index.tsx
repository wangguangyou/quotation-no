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
  InputNumber,
  Typography,
} from 'antd'
const { Text } = Typography
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
import { useSearchParams } from 'next/navigation'

type Quotation = unwrapResponse<typeof getQuotationPage>[number]

const Page: NextPage = () => {
  const state = useSnapshot(dataState)
  const currentUserState = useSnapshot(userState)
  const router = useRouter()

  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [profitVisible, setProfitVisible] = useState(false)
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

  const onFinish = (values?: any) => {
    if (values) {
      const { status } = values
      values.complete = false
      if (status === 100) {
        values = { ...values, status: 10, complete: true }
      }
    }
    if (values) {
      setQuery((val) => Object.assign(val, values))
    } else {
      setQuery((val) =>
        Object.assign(
          val,
          Object.keys(val).reduce(
            (pre: Record<string, any>, cur: string) => (
              (pre[cur] = undefined), pre
            ),
            val
          )
        )
      )
    }
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
    await setQuotationStatus(record.id, {
      newStatus: record.quotedStatus === 21 ? 11 : 10,
    })
    init()
  }
  const handleReject = async (record: Quotation) => {
    await setQuotationStatus(record.id, { newStatus: record.buyer ? 21 : 20 })
    init()
  }
  const onProfitFinish = async (values: any) => {
    await setQuotationStatus(currentRecord!.id, { newStatus: 30, ...values })
    setProfitVisible(false)
    init()
  }
  const getShowDel = (record: Quotation) => {
    if (currentUserState.isAdmin) return true
    if (currentUserState.isClerk) return record.quotedStatus === 20
    if (currentUserState.isBuyer) return [20, 21].includes(record.quotedStatus)
    if (currentUserState.isManager)
      return [20, 21].includes(record.quotedStatus)
    return false
  }

  const expandedRowRender = (record: Quotation, index: number) => {
    return (
      record && (
        <Descriptions
          contentStyle={{ width: 0, paddingRight: '8px' }}
          className="pt-8"
          size="small"
          column={7}
        >
          <Descriptions.Item label="业务员">
            {record.clerk || '无'}
          </Descriptions.Item>
          <Descriptions.Item label="采购员">
            {record.buyer || '无'}
          </Descriptions.Item>
          <Descriptions.Item label="经理">
            {record.manager || '无'}
          </Descriptions.Item>
          <Descriptions.Item label="客户信息">
            <Text ellipsis={{ tooltip: record.customerInfo }}>
              {record.customerInfo}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="客户精准定位">
            <Text ellipsis={{ tooltip: record.customerPosition }}>
              {record.customerPosition}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="客户价格">
            {record.customerPrice}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      )
    )
  }
  return (
    <>
      <FadeIn>
        <Card bordered={false}>
          <Form
            initialValues={{ status }}
            layout="inline"
            onFinish={onFinish}
            onReset={() => onFinish()}
            autoComplete="off"
            className="mb-[-24px]!"
          >
            <Form.Item className="mb-24!" label="业务员" name="clerk">
              <Input allowClear />
            </Form.Item>
            <Form.Item className="mb-24!" label="采购员" name="buyer">
              <Input allowClear />
            </Form.Item>
            <Form.Item className="mb-24!" label="状态" name="status">
              <Select
                allowClear
                className="w-183!"
                options={state.statusList as any}
              />
            </Form.Item>

            <Form.Item className="mb-24!" label="客户信息" name="cInfo">
              <Input allowClear />
            </Form.Item>
            <Form.Item className="mb-24!" label="客户精准定位" name="cPosition">
              <Input allowClear />
            </Form.Item>

            <Form.Item className="mb-24!">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item className="mb-24!">
              <Button htmlType="reset">重置</Button>
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
              key={+loading}
              expandable={{
                expandedRowRender,
                defaultExpandAllRows: true,
              }}
              onChange={onChange}
              pagination={{
                ...pagination,
                showTotal: (total) => `共${total}条`,
                showSizeChanger: true,
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

              <Table.Column
                ellipsis={true}
                title="面料"
                dataIndex="fabric"
                key="fabric"
              />
              <Table.Column
                ellipsis={true}
                title="底料"
                dataIndex="primer"
                key="primer"
              />
              <Table.Column
                ellipsis={true}
                title="印刷"
                dataIndex="printMethod"
                key="printMethod"
              />
              <Table.Column
                ellipsis={true}
                title="边缘处理"
                dataIndex="edgeProcess"
                key="edgeProcess"
              />
              <Table.Column
                ellipsis={true}
                title="运输方式"
                dataIndex="transport"
                key="transport"
              />

              <Table.Column
                title="成本单价"
                dataIndex="costPrice"
                key="costPrice"
                render={(costPrice) => costPrice.toFixed(2)}
              />
              <Table.Column
                title="未税单价"
                dataIndex="costPrice"
                key="costPrice"
                render={(costPrice, record: Quotation) =>
                  (costPrice + record.profit).toFixed(2)
                }
              />

              <Table.Column
                title="税后单价"
                dataIndex="taxPrice"
                key="taxPrice"
                render={(taxPrice) => taxPrice.toFixed(2)}
              />

              <Table.Column title="利润" dataIndex="profit" key="profit" />
              <Table.Column
                title="利润率"
                dataIndex="profitMargin"
                key="profitMargin"
                render={(profitMargin) =>
                  `${(profitMargin * 100 || 0).toFixed(0)}%`
                }
              />

              <Table.Column
                fixed={'right'}
                title="总价"
                dataIndex="quotedPrice"
                key="quotedPrice"
                render={(quotedPrice) => quotedPrice.toFixed(2)}
              />
              <Table.Column
                fixed={'right'}
                title="操作"
                key="action"
                width={150}
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

                    {![30].includes(record.quotedStatus) && (
                      <AuthWrap auth="edit-no">
                        <Button
                          size="small"
                          type="link"
                          onClick={() => editRecord(record)}
                        >
                          {currentUserState.isClerk ? '修改' : '完善'}
                        </Button>
                      </AuthWrap>
                    )}

                    {[0, 10, 11].includes(record.quotedStatus) &&
                      record.buyer && (
                        <AuthWrap auth="input-profit">
                          <Button
                            onClick={() => (
                              setCurrentRecord(record), setProfitVisible(true)
                            )}
                            size="small"
                            type="link"
                          >
                            填写利润
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

                    {![20, 21, 30].includes(record.quotedStatus) && (
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

                    {getShowDel(record) && (
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
        <h1 className="mt-0">
          {currentUserState.isClerk ? '修改' : '完善'}报价单
        </h1>
        <div className="overflow-y-auto max-h-80vh">
          <MainForm
            afterEdit={() => (setIsModalOpen(false), init())}
            data={currentRecord}
          ></MainForm>
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
        <div className="overflow-y-auto max-h-80vh min-h-60vh">
          {currentRecord && <Detail data={currentRecord}></Detail>}
        </div>
      </Modal>

      <Modal
        title={'填写利润'}
        destroyOnClose
        open={profitVisible}
        footer={null}
        centered
        width={380}
        onCancel={() => setProfitVisible(false)}
      >
        <Form
          autoComplete="off"
          onFinish={onProfitFinish}
          className="mt-30 text-left mx-a"
          layout="vertical"
          style={{ maxWidth: 300 }}
        >
          <div className="mt-40"></div>
          <Form.Item label="利润" name="profit" rules={[{ required: true }]}>
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
export default Page
