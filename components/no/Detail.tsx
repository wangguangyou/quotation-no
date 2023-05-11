import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import FadeIn from '@/components/FadeIn'
import { Table, Descriptions, Tag, Spin } from 'antd'
import { getQuotationDetail, getQuotationParam } from '@/api/quotation'
import Status from './Status'
import dataState from '@/store/data'
import userState from '@/store/user'
import { useSnapshot } from 'valtio'
type DetailType = unwrapResponse<typeof getQuotationDetail>
type QuotationParam = unwrapResponse<typeof getQuotationParam>
import type { ColumnsType } from 'antd/es/table'
import type { AccyItem, Quotation } from '@/api/types'
type DataType = Partial<AccyItem>

const columns: ColumnsType<DataType> = [
  {
    title: '序号',
    dataIndex: 'name',
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '数量',
    dataIndex: 'qty',
    ellipsis: true,
  },
  {
    title: '材质',
    dataIndex: 'material',
    ellipsis: true,
  },
  {
    title: '大小',
    dataIndex: 'size',
    ellipsis: true,
  },
  {
    title: '印刷',
    dataIndex: 'print',
    ellipsis: true,
  },
  {
    title: '其他要求',
    dataIndex: 'other',
    ellipsis: true,
  },
  {
    title: '价格',
    dataIndex: 'price',
    ellipsis: true,
  },
  {
    title: '辅料产品单价',
    ellipsis: true,
    render: (_, record) => {
      const { qty, price } = record
      if (!qty || !price) return '-'
      return qty * price
    },
  },
]

const Detail = ({ data }: { data: Quotation }) => {
  const hotDataState = useSnapshot(dataState)
  const hotUserState = useSnapshot(userState)
  const [values, setValues] = useState<DetailType>()
  const [raw, setRaw] = useState<QuotationParam>()
  const getUnit = (unitCode: string) => {
    return values?.computeResult.unitResult.find(
      (find) => find.unitCode === unitCode
    )
  }
  useEffect(() => {
    ;(async () => {
      if (data) {
        const { data: values } = await getQuotationDetail(data.id)
        setValues(values)
      }
    })()
    ;(async () => {
      if (data) {
        const { data: raw } = await getQuotationParam(data.id)
        setRaw(raw)
      }
    })()
  }, [data])

  useEffect(() => {
    hotDataState.initOptions()
  }, [])

  return (
    <Spin spinning={!values}>
      <div className="pb-16">
        {values && (
          <FadeIn>
            <Descriptions
              contentStyle={{ maxWidth: '300px' }}
              title="基础信息"
              size="small"
              bordered
            >
              <Descriptions.Item label="客户信息">
                {values.quotation.customerInfo}
              </Descriptions.Item>
              <Descriptions.Item label="客户精准定位">
                {values.quotation.customerPosition}
              </Descriptions.Item>
              <Descriptions.Item label="客户价格">
                {values.quotation.customerPrice}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Status record={values.quotation}></Status>
              </Descriptions.Item>
              <Descriptions.Item label="产品尺寸">
                {values.quotation.length}*{values.quotation.width}*
                {values.quotation.height}
              </Descriptions.Item>
              <Descriptions.Item label="不良率">
                {getUnit('DefectiveRate')?.value}
              </Descriptions.Item>

              <Descriptions.Item label="订单数量">
                {values.quotation.size}
              </Descriptions.Item>
              <Descriptions.Item label="印刷方式">
                {getUnit('PrintMethod')?.typeName}
              </Descriptions.Item>
              <Descriptions.Item label="边缘处理方式">
                {getUnit('EdgeProcess')?.typeName}
                {getUnit('EdgeProcess')?.typeCode ===
                  'LuminousStripOverLockEP' &&
                  (raw?.edgeProcessParam?.needDriverChip ? (
                    <Tag className="ml-16" color="blue">
                      需要芯片
                    </Tag>
                  ) : (
                    <Tag className="ml-16" color="gold">
                      不需要芯片
                    </Tag>
                  ))}
              </Descriptions.Item>
              {raw?.printMethod?.code === 'SilkPrintPM' && (
                <>
                  <Descriptions.Item label="网板次数">
                    {raw?.printMethod.stencilCount}
                  </Descriptions.Item>
                  <Descriptions.Item label="丝印次数" span={2}>
                    {raw?.printMethod.silkPrintCount}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="面料">
                {hotDataState.getOptionsLabel('mt', raw?.materialParam?.mapId)}
              </Descriptions.Item>
              <Descriptions.Item label="底料" span={2}>
                {hotDataState.getOptionsLabel('pr', raw?.primerParam?.mapId)}
              </Descriptions.Item>
              <Descriptions.Item label="运输方式">
                {values.transport || getUnit('Freight')?.typeName}
              </Descriptions.Item>
              <Descriptions.Item label="运费付款方式">
                {hotDataState.getOptionsLabel(
                  'shippingPayment',
                  raw?.shippingPayment
                )}
              </Descriptions.Item>
              <Descriptions.Item label="运费" span={2}>
                {getUnit('Freight')?.value.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="发票类型">
                {values.tax || getUnit('TaxRate')?.typeName}
              </Descriptions.Item>
              <Descriptions.Item label="税率" span={2}>
                {getUnit('TaxRate')?.value}
              </Descriptions.Item>
              <Descriptions.Item label="业务员">
                {data.clerk || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="采购员">
                {data.buyer || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="副经理">
                {data.manager || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="包装要求" span={3}>
                摆放方式:{' '}
                {hotDataState.getOptionsLabel('placement', raw?.placement)}
                <br />
                列: {values.quotationPackage.row}
                <br />
                排: {values.quotationPackage.col}
                <br />
                层: {values.quotationPackage.layer}
                <br />
                整箱数量: {values.quotationPackage.pcs}
                <br />
                整箱毛重: {values.quotationPackage.weight}
                <br />
                整箱体积: {values.quotationPackage.volume}
                <br />
              </Descriptions.Item>
              {!hotUserState.isClerk && (
                <Descriptions.Item label="成本单价">
                  {data.costPrice.toFixed(2)}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="税后单价" span={2}>
                {data.taxPrice.toFixed(2)}
              </Descriptions.Item>
              {!hotUserState.isClerk && (
                <>
                  <Descriptions.Item label="利润">
                    {data.profit.toFixed(2)}
                  </Descriptions.Item>
                  <Descriptions.Item label="利润率" span={2}>
                    {data.profitPercentage || '-'}
                  </Descriptions.Item>
                </>
              )}

              <Descriptions.Item label="总价">
                {data.quotedPrice.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
            <div>
              <div className="color-rgba(0, 0, 0, 0.88) fw-600 text-16 my-20">
                辅料明细
              </div>

              <Table
                pagination={false}
                rowKey="id"
                columns={columns}
                dataSource={values.accyList}
                size="small"
              />
            </div>
          </FadeIn>
        )}
      </div>
    </Spin>
  )
}

export default Detail
