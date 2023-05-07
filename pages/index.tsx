import type { NextPageWithLayout } from './_app'
import dynamic from 'next/dynamic'
import { Card } from 'antd'
import { Col, Row, Statistic } from 'antd'
import { useEffect, useState } from 'react'
import { getSimpleStats } from '@/api'
type SimpleStats = unwrapResponse<typeof getSimpleStats>
const Pie = dynamic(() => import('@ant-design/plots').then(({ Pie }) => Pie), {
  ssr: false,
})
const CountUp = dynamic(() => import('react-countup'), {
  ssr: false,
})

const formatter = (value: any) => (
  <CountUp decimals={2} end={value} separator="," />
)

const Home: NextPageWithLayout = () => {
  const [values, setValues] = useState<SimpleStats>()
  useEffect(() => {
    ;(async () => {
      const { data: values } = await getSimpleStats()
      setValues(values)
    })()
  }, [])

  const config = {
    data: [
      {
        type: '未完成',
        value: (values?.allQuotation || 0) - (values?.completeQuotation || 0),
      },
      {
        type: '已完成',
        value: values?.completeQuotation,
      },
    ],
    autoFit: true,
    appendPadding: 10,
    radius: 1,
    innerRadius: 0.6,
    statistic: false,
    angleField: 'value',
    colorField: 'type',
    legend: false,
    color: ({ type }: any) => {
      const map: any = {
        已完成: 'rgb(110,147,242)',
      }
      return map[type] || 'rgb(240,240,240)'
    },
    label: {
      type: 'inner',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        opacity: 0,
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  } as any
  const config2 = {
    data: [
      {
        type: '未完善',
        value:
          (values?.allQuotation || 0) - (values?.toBePerfectedQuotation || 0),
      },
      {
        type: '已完善',
        value: values?.toBePerfectedQuotation,
      },
    ],
    autoFit: true,
    appendPadding: 10,
    radius: 1,
    innerRadius: 0.6,
    statistic: false,
    angleField: 'value',
    colorField: 'type',
    legend: false,
    color: ({ type }: any) => {
      const map: any = {
        已完善: 'rgb(132,222,194)',
      }
      return map[type] || 'rgb(240,240,240)'
    },
    label: {
      type: 'inner',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        opacity: 0,
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  } as any

  const config3 = {
    data: [
      {
        type: '未成交金额',
        value: +(
          (values?.totalAmount || 0) - (values?.completeAmount || 0)
        ).toFixed(2),
      },
      {
        type: '已成交金额',
        value: +(values?.completeAmount || 0).toFixed(2),
      },
    ],
    autoFit: true,
    appendPadding: 10,
    radius: 1,
    statistic: false,
    angleField: 'value',
    colorField: 'type',
    legend: false,
    color: ({ type }: any) => {
      const map: any = {
        已成交金额: 'rgb(110,120,255)',
      }
      return map[type] || 'rgb(240,240,240)'
    },
    label: {
      type: 'inner',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        opacity: 0,
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  } as any
  const config4 = {
    data: [
      {
        type: '',
        value: +(
          (values?.totalAmount || 0) - (values?.toBePerfectedAmount || 0)
        ).toFixed(2),
      },
      {
        type: '待成交金额',
        value: +(values?.toBePerfectedAmount || 0).toFixed(2),
      },
    ],
    autoFit: true,
    appendPadding: 10,
    radius: 1,
    statistic: false,
    angleField: 'value',
    colorField: 'type',
    legend: false,
    color: ({ type }: any) => {
      const map: any = {
        待成交金额: 'rgb(148,104,230)',
        // 待成交金额: 'rgb(100,255,220)',
      }
      return map[type] || 'rgb(240,240,240)'
    },
    label: {
      type: 'inner',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        opacity: 0,
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  } as any
  return (
    <>
      <Card bordered={false} className="mb-24 h-200">
        <div className="grid grid-cols-3">
          <Statistic
            className="place-self-center text-20"
            valueStyle={{ fontSize: 48 }}
            title="报价单总数"
            value={values?.allQuotation}
            formatter={formatter}
          />
          <div className="flex items-center">
            <div className="h-140 w-140  mr-24">
              <Pie {...config}></Pie>
            </div>
            <Statistic
              className="flex-1"
              title="已完成报价单"
              value={values?.completeQuotation}
              precision={2}
              formatter={formatter}
            />
          </div>

          <div className="flex items-center">
            <div className="h-140 w-140 mr-24">
              <Pie {...config2}></Pie>
            </div>
            <Statistic
              className="flex-1"
              title="待完善报价单"
              value={values?.toBePerfectedQuotation}
              precision={2}
              formatter={formatter}
            />
          </div>
        </div>
      </Card>

      <Card bordered={false} className="px-48 py-24">
        <Statistic
          className="text-center"
          valueStyle={{ fontSize: 34 }}
          title="总金额"
          value={values?.totalAmount}
          precision={2}
          formatter={formatter}
        />

        <div className="grid grid-cols-2 pt-24">
          <div className="flex flex-col items-center">
            <Statistic
              className="text-center"
              title="已成交金额"
              value={values?.completeAmount}
              precision={2}
              formatter={formatter}
            />
            <div className="h-240 w-240">
              <Pie {...config3}></Pie>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Statistic
              className="text-center"
              title="待成交金额"
              value={values?.toBePerfectedAmount}
              precision={2}
              formatter={formatter}
            />
            <div className="h-240 w-240">
              <Pie {...config4}></Pie>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}
export default Home
