import type { NextPageWithLayout } from './_app'
import dynamic from 'next/dynamic'
import FadeIn from '@/components/FadeIn'
import { Card } from 'antd'
import { Progress, Statistic } from 'antd'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSimpleStats } from '@/api'
type SimpleStats = unwrapResponse<typeof getSimpleStats>
const Pie = dynamic(() => import('@ant-design/plots').then(({ Pie }) => Pie), {
  ssr: false,
})

const CountUp = dynamic(() => import('react-countup'), {
  ssr: false,
})

const formatter = (value: any, precision?: any) => (
  <CountUp decimals={precision || 0} end={value} separator="," />
)

const Home: NextPageWithLayout = () => {
  const router = useRouter()
  const [values, setValues] = useState<SimpleStats>()
  useEffect(() => {
    ;(async () => {
      const { data: values } = await getSimpleStats()
      setValues(values)
    })()
  }, [])
  const jumpHandler = (status?: number) => {
    // router.push(status ? `/list?status=${status}` : `/list`)
  }

  const countConfig0 = {
    data: [
      {
        type: '待完成',
        value: values?.toBeCompletedQuotation,
      },
      {
        type: '待完善',
        value: values?.toBePerfectedQuotation,
      },
      {
        type: '已完成',
        value: values?.completeQuotation,
      },
    ],
    autoFit: true,
    appendPadding: 10,
    radius: 1,
    statistic: false,
    angleField: 'value',
    colorField: 'type',
    legend: false,
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
  const countConfig1 = {
    data: [
      {
        type: '',
        value: (values?.allQuotation || 0) - (values?.completeQuotation || 0),
      },
      {
        type: '已完成',
        value: values?.completeQuotation,
      },
    ],
    tooltip: false,
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
        已完成: '#657797',
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
  const countConfig2 = {
    data: [
      {
        type: '',
        value:
          (values?.allQuotation || 0) - (values?.toBePerfectedQuotation || 0),
      },
      {
        type: '待完善',
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
        待完善: '#62daaa',
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
  const countConfig3 = {
    data: [
      {
        type: '',
        value:
          (values?.allQuotation || 0) - (values?.toBeCompletedQuotation || 0),
      },
      {
        type: '待完成',
        value: values?.toBeCompletedQuotation,
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
        待完成: '#6394f9',
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

  const totalConfig0 = {
    data: [
      {
        type: '待完成报价单总金额',
        value: values?.toBeCompletedAmount,
      },
      {
        type: '待完善报价单总金额',
        value: values?.toBePerfectedAmount,
      },
      {
        type: '已完成总金额',
        value: values?.completeAmount,
      },
    ],
    autoFit: true,
    appendPadding: 10,
    radius: 1,
    statistic: false,
    angleField: 'value',
    colorField: 'type',
    legend: false,
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
    <FadeIn className="h-full flex flex-col" childrenClass={[, 'flex-1']}>
      <Card bordered={false} className="mb-24">
        <div className="grid grid-cols-[25vw_repeat(3,minmax(0,1fr))]">
          <div className="flex items-center">
            <div className="h-200 w-200  mr-16">
              <Pie {...countConfig0} />
            </div>
            <div onClick={() => jumpHandler()}>
              <Statistic
                className="place-self-center text-20"
                valueStyle={{ fontSize: 48 }}
                title="报价单总数"
                value={values?.allQuotation}
                formatter={formatter}
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-140 w-140  mr-16 pointer-events-none">
              <Pie {...countConfig1}></Pie>
            </div>
            <div onClick={() => jumpHandler(30)}>
              <Statistic
                className="flex-1"
                title="已完成报价单"
                value={values?.completeQuotation}
                precision={2}
                formatter={formatter}
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-140 w-140 mr-16 pointer-events-none">
              <Pie {...countConfig2}></Pie>
            </div>
            <div onClick={() => jumpHandler()}>
              <Statistic
                className="flex-1"
                title="待完善报价单"
                value={values?.toBePerfectedQuotation}
                precision={2}
                formatter={formatter}
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-140 w-140 mr-16 pointer-events-none">
              <Pie {...countConfig3}></Pie>
            </div>
            <div onClick={() => jumpHandler()}>
              <Statistic
                className="flex-1"
                title="待完成报价单"
                value={values?.toBeCompletedQuotation}
                precision={2}
                formatter={formatter}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card bordered={false} className="px-48 py-24 h-full">
        <div className="flex items-center flex-wrap min-h-400">
          <div className="space-y-16">
            {[
              { label: '已完成总金额', value: values?.completeAmount },
              {
                label: '待完善报价单总金额',
                value: values?.toBePerfectedAmount,
              },
              {
                label: '待完成报价单总金额',
                value: values?.toBeCompletedAmount,
              },
            ].map(({ label, value }) => (
              <div className="flex items-center" key={label}>
                <span className=" text-#8f8f8f w-230 text-right">{label}</span>

                <Progress
                  className="mx-24 my-0 w-300"
                  size={[300, 20]}
                  strokeLinecap="butt"
                  percent={50}
                  showInfo={false}
                />
                <span className="ws-nowrap flex-1">
                  {value
                    ? `￥ ${Number(value.toFixed(2)).toLocaleString()}`
                    : '0'}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center ml-120">
            <div className="h-200 w-200 mr-24">
              <Pie {...totalConfig0}></Pie>
            </div>
            <Statistic
              prefix="￥"
              className="text-center"
              valueStyle={{ fontSize: 48 }}
              title="报价单总金额"
              value={values?.totalAmount}
              precision={2}
              formatter={(val) => formatter(val, 2)}
            />
          </div>
        </div>
      </Card>
    </FadeIn>
  )
}
export default Home
