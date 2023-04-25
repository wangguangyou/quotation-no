import type { NextPageWithLayout } from '../_app'
import { Card, Tabs } from 'antd'
import type { TabsProps } from 'antd'

const items: TabsProps['items'] = [
  {
    label: `印刷方式`,
    children: `Content of Tab Pane 1`,
  },
  {
    label: `边缘处理方式`,
    children: `Content of Tab Pane 2`,
  },
  {
    label: `面料`,
    children: `Content of Tab Pane 3`,
  },
  {
    label: `底料`,
    children: `Content of Tab Pane 3`,
  },
  {
    label: `辅料明细`,
    children: `Content of Tab Pane 3`,
  },
  {
    label: `不良率`,
    children: `Content of Tab Pane 3`,
  },
  {
    label: `报价明细`,
    children: `Content of Tab Pane 3`,
  },
  {
    label: `印刷 - 大货纸`,
    children: `Content of Tab Pane 3`,
  },
].map((item, index) => ({ ...item, key: String(index) }))

const Template: NextPageWithLayout = () => {
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
export default Template
