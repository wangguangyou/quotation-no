import { Form, Input, Button } from 'antd'

const MainForm = () => {
  const onFinish = async (values: any) => {
    //
  }

  return (
    <div className="relative">
      <Form onFinish={onFinish}>
        <div className="pb-150 space-y-32">
          <div>
            <div className="divider mb-24">
              <div className="text-#888 inline-block text-20 fw-600 mb-12">
                客户资料
              </div>
            </div>

            <Form.Item
              labelCol={{ span: 3 }}
              label="客户信息"
              name="name"
              rules={[{ required: true, message: '此项必填' }]}
            >
              <Input className="w-300" placeholder="旺旺、微信、客户名称等" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 3 }}
              label="客户精准定位"
              name="name"
              rules={[{ required: true, message: '此项必填' }]}
            >
              <Input className="w-300" placeholder="C店、外贸公司、商超等" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 3 }}
              label="客户价格"
              name="name"
              rules={[{ required: true, message: '此项必填' }]}
            >
              <Input
                className="w-300"
                placeholder="是否有目标价，是否已有长期合作供应商"
              />
            </Form.Item>
          </div>
          <div>
            <div className="divider mb-24">
              <div className="text-#888  inline-block text-20 fw-600 mb-12">
                产品基础资料
              </div>
            </div>
          </div>

          <div>
            <div className="divider mb-24">
              <div className="text-#888 inline-block text-20 fw-600 mb-12">
                主材料&辅料
              </div>
            </div>
          </div>

          <div>
            <div className="divider mb-24">
              <div className="text-#888 inline-block text-20 fw-600 mb-12">
                装箱资料
              </div>
            </div>
          </div>

          <div>
            <div className="divider mb-24">
              <div className="text-#888 inline-block text-20 fw-600 mb-12">
                物流运输
              </div>
            </div>
          </div>

          <div>
            <div className="divider mb-24">
              <div className="text-#888 inline-block text-20 fw-600 mb-12">
                开票信息
              </div>
            </div>
          </div>
        </div>
      </Form>

      <footer
        className="h-150 absolute bottom-0 left-0 w-full flex items-center justify-end px-45
     "
      >
        <span>合计： </span>

        <span className="linear-text inline-block text-40 fw-600"> 12323 </span>
      </footer>
    </div>
  )
}
export default MainForm
