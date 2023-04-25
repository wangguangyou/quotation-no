import { Form, Input, Button, InputNumber, Select, Switch } from 'antd'
import { useEffect, useRef } from 'react'

const MainForm = ({ data }: { data?: any }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({})
  }, [data])

  return (
    <div className="relative">
      <Form form={form}>
        <div className="pb-130 space-y-32">
          <div>
            <div className="divider mb-32">
              <div className="text-#666 inline-block text-20 fw-600 mb-12">
                客户资料
              </div>
            </div>

            <Form.Item
              labelCol={{ span: 3 }}
              label="客户信息"
              name="name"
              rules={[{ required: true }]}
            >
              <Input className="w-300" placeholder="旺旺、微信、客户名称等" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 3 }}
              label="客户精准定位"
              name="name"
              rules={[{ required: true }]}
            >
              <Input className="w-300" placeholder="C店、外贸公司、商超等" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 3 }}
              label="客户价格"
              name="name"
              rules={[{ required: true }]}
            >
              <Input
                className="w-300"
                placeholder="是否有目标价，是否已有长期合作供应商"
              />
            </Form.Item>
          </div>
          <div>
            <div className="divider mb-32">
              <div className="text-#666  inline-block text-20 fw-600 mb-12">
                产品基础资料
              </div>
            </div>
            <div className="pl-24">
              <div className="text-#666 text-16 mb-12">产品尺寸</div>

              <div className="fi space-x-24">
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="长(CM)"
                  name="l"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="宽(CM)"
                  name="w"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="厚(MM)"
                  name="h"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="pl-24 ">
              <div className="text-#666 text-16 mb-12">产品数量</div>

              <div className="fi space-x-24">
                <Form.Item
                  label="订单数量"
                  name="sum"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200!"
                    placeholder="请输入内容"
                    addonAfter="PCS"
                  />
                </Form.Item>
                <Form.Item
                  label="印刷方式"
                  name="ysfs"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={[{ value: 'lucy', label: 'Lucy' }]}
                  />
                </Form.Item>
                <Form.Item
                  label="边缘处理方式"
                  name="byclfs"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={[{ value: 'lucy', label: 'Lucy' }]}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div>
            <div className="divider mb-32">
              <div className="text-#666 inline-block text-20 fw-600 mb-12">
                主材料&辅料
              </div>
            </div>

            <div className="pl-24">
              <div className="text-#666 text-16 mb-12">材质</div>

              <div className="fi space-x-24">
                <Form.Item
                  label="面料"
                  name="ysfs"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={[{ value: 'lucy', label: 'Lucy' }]}
                  />
                </Form.Item>
                <Form.Item
                  label="底料"
                  name="byclfs"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={[{ value: 'lucy', label: 'Lucy' }]}
                  />
                </Form.Item>
              </div>

              <div className="text-#666 text-16 mb-12">辅料明细</div>
            </div>
          </div>

          <div>
            <div className="divider mb-32">
              <div className="text-#666 inline-block text-20 fw-600 mb-12">
                装箱资料
              </div>
            </div>

            <div className="pl-24">
              <div className="text-#666 text-16 mb-12">包装要求</div>

              <div className="fi space-x-24">
                <Form.Item
                  label="摆放方式"
                  name="ysfs"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={[{ value: 'lucy', label: 'Lucy' }]}
                  />
                </Form.Item>
              </div>

              <div className="text-#666 text-16 mb-12">纸箱尺寸</div>
              <div className="fi space-x-24">
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="长(CM)"
                  name="l"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="宽(CM)"
                  name="w"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="厚(MM)"
                  name="h"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
              </div>
              <div className="fi space-x-24">
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="整箱数量"
                  name="l"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="整箱毛重"
                  name="w"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="整箱体积"
                  name="h"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div>
            <div className="divider mb-32">
              <div className="text-#666 inline-block text-20 fw-600 mb-12">
                物流运输
              </div>
            </div>

            <div className="fi space-x-24">
              <Form.Item
                label="运输方式"
                name="ysfs"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="请选择"
                  className="w-200!"
                  options={[{ value: 'lucy', label: 'Lucy' }]}
                />
              </Form.Item>
              <Form.Item
                label="运输付款方式"
                name="byclfs"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="请选择"
                  className="w-200!"
                  options={[{ value: 'lucy', label: 'Lucy' }]}
                />
              </Form.Item>
              <Form.Item
                label="运费"
                name="byclfs"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  className="w-200"
                  placeholder="请输入内容"
                />
              </Form.Item>
            </div>
          </div>

          <div>
            <div className="divider mb-32">
              <div className="text-#666 inline-block text-20 fw-600 mb-12">
                开票信息
              </div>
            </div>
            <div className="fi space-x-24">
              <Form.Item
                label="增值税发票"
                name="byclfs"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item label="普通发票" name="byclfs" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>

      <footer
        className="h-130 absolute bottom-0 left-0 w-full flex items-center 
     "
      >
        <div>
          <span className="text-18 text-#888 mr-12 align-text-bottom">
            合计
          </span>
          <span className="linear-text inline-block text-40 fw-600">
            {(12323).toLocaleString()}
          </span>

          <div className="mt-16">
            <Button
              shape="round"
              size="large"
              type="primary"
              className="w-full"
            >
              提交
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default MainForm
