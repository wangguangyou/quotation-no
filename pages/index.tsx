import type { NextPageWithLayout } from './_app'
import dynamic from 'next/dynamic'
import { Card } from 'antd'
const Column = dynamic(
  () => import('@ant-design/plots').then(({ Column }) => Column),
  {
    ssr: false,
  }
)
const Home: NextPageWithLayout = () => {
  const data = [
    {
      type: '家具家电',
      sales: 38,
    },
    {
      type: '粮油副食',
      sales: 52,
    },
    {
      type: '生鲜水果',
      sales: 61,
    },
    {
      type: '美容洗护',
      sales: 145,
    },
    {
      type: '母婴用品',
      sales: 48,
    },
    {
      type: '进口食品',
      sales: 38,
    },
    {
      type: '食品饮料',
      sales: 38,
    },
    {
      type: '家庭清洁',
      sales: 38,
    },
  ]
  const config = {
    data,
    xField: 'type',
    yField: 'sales',
    label: {
      position: 'top',
    },
    appendPadding: 24,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  } as any
  return (
    <Card bordered={false}>
      <Column {...config} />
    </Card>
  )
}
export default Home
