import type { NextPageWithLayout } from '../_app'
import { Card, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import Fixed from '@/components/param/Fixed'
import BadMap from '@/components/param/BadMap'
import BadRange from '@/components/param/BadRange'
import Fre from '@/components/param/Fre'
import MT from '@/components/param/MT'
import PR from '@/components/param/PR'
import Tax from '@/components/param/Tax'
import POL from '@/components/param/POL'
import LSOL from '@/components/param/LSOL'
import UV from '@/components/param/UV'
import LCP from '@/components/param/LCP'

const items: TabsProps['items'] = [
  {
    label: `固定参数`,
    children: <Fixed />,
  },
  {
    label: `常规不良率`,
    children: <BadMap />,
  },
  {
    label: `非常规不良率`,
    children: <BadRange />,
  },
  {
    label: `运费`,
    children: <Fre />,
  },
  {
    label: `面料`,
    children: <MT />,
  },
  {
    label: `底料`,
    children: <PR />,
  },
  {
    label: `税率`,
    children: <Tax />,
  },
  {
    label: `边缘处理 - 精密锁边`,
    children: <POL />,
  },
  {
    label: `边缘处理 - 发光条`,
    children: <LSOL />,
  },
  {
    label: `打印方式 - UV`,
    children: <UV />,
  },
  {
    label: `打印方式 - 大货纸`,
    children: <LCP />,
  },
].map((item, index) => ({ ...item, key: String(index) }))

const Page: NextPageWithLayout = () => {
  return (
    <Card
      bodyStyle={{ height: '100%', padding: '24px 24px 24px 6px' }}
      className="h-full"
      bordered={false}
    >
      <Tabs
        className="h-full"
        defaultActiveKey="0"
        tabPosition="left"
        items={items}
      />
    </Card>
  )
}
export default Page
