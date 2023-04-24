import type { NextPageWithLayout } from './_app'
import { Card } from 'antd'
import MainForm from '@/components/MainForm'
const Home: NextPageWithLayout = () => {
  return (
    <Card bordered={false}>
      <MainForm />{' '}
    </Card>
  )
}
export default Home
