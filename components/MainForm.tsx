import { Form, Input, Button, InputNumber, Select, Checkbox } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getComputeUnit, getSubComputeUnit, checkCompute } from '@/api'
import { addQuotation } from '@/api/quotation'
import {
  getMtAll,
  getPrAll,
  getTaxAll,
  getFreAll,
  getAccyAll,
} from '@/api/param'

import Excel from '@/components/no/Excel'
type ExcelHandle = React.ElementRef<typeof Excel>

const MainForm = ({ data }: { data?: any }) => {
  const excelRef = useRef<ExcelHandle>(null)
  const [form] = Form.useForm()
  const [options, setOptions] = useState<Record<string, any>>({})
  const [checkData, setCheckData] =
    useState<unwrapResponse<typeof checkCompute>>()
  const [badRateParamDisabled, setBadRateParamDisabled] = useState(true)
  const [showNeedDriverChip, setShowNeedDriverChip] = useState(false)
  const [isSilkPrintPM, setIsSilkPrintPM] = useState(false)
  const initSelectData = async () => {
    const { data } = await getComputeUnit()
    console.log(data)
  }
  useEffect(() => {
    Promise.all([
      getFreAll(),
      getMtAll(),
      getPrAll(),
      getTaxAll(),
      getAccyAll(),
      getSubComputeUnit('PrintMethod'),
      getSubComputeUnit('EdgeProcess'),
    ]).then(
      ([
        { data: fre },
        { data: mt },
        { data: pr },
        { data: tax },
        { data: accy },
        { data: PrintMethod },
        { data: EdgeProcess },
      ]) => {
        setOptions({
          fre: fre.map(({ id, company }) => ({
            value: id,
            label: company,
          })),
          mt: mt.map(({ id, materialName }) => ({
            value: id,
            label: materialName,
          })),
          pr: pr.map(({ id, primerName }) => ({
            value: id,
            label: primerName,
          })),
          tax: tax.map(({ id, rateName }) => ({
            value: id,
            label: rateName,
          })),
          accy: accy.map(({ id, accyName }) => ({
            value: id,
            label: accyName,
          })),
          PrintMethod: PrintMethod.map(({ typeCode, typeName }) => ({
            value: typeCode,
            label: typeName,
          })),
          EdgeProcess: EdgeProcess.map(({ typeCode, typeName }) => ({
            value: typeCode,
            label: typeName,
          })),
        })
      }
    )
    // initSelectData()
  }, [])

  const onFinish = async () => {
    const accyItemList = await excelRef.current!.validator()
    console.log(accyItemList)
    const [values] = await Promise.all([
      form.validateFields(),
      // excelRef.current!.validator(),
    ])

    // const accyItemList = excelRef.current?.dataSource
    const {
      info,
      position,
      price,
      length,
      width,
      height,
      size,
      badRateParam,
      materialParam,
      edgeProcessParam,
      printMethod,
      stencilCount,
      silkPrintCount,
      primerParam,
      row,
      col,
      layer,
      taxRateParam,
      freightParam,
    } = values
    const params = {
      length,
      width,
      height,
      size,
      printMethod: {
        code: printMethod,
        stencilCount, // ⽹板次数
        silkPrintCount, // 丝印次数
      },
      packageParam: {
        row,
        col,
        layer,
      },
      materialParam: {
        mapId: materialParam,
      },
      freightParam: {
        mapId: freightParam,
      },
      primerParam: {
        mapId: primerParam,
      },
      taxRateParam: {
        mapId: taxRateParam,
      },
      badRateParam: {
        inputRate: badRateParam,
      },
      edgeProcessParam: {
        code: edgeProcessParam,
        needDriverChip: false,
      },
      customerParam: {
        info,
        position,
        price,
      },
      accyParam: {
        accyItemList,
      },
    }
    addQuotation(params)
  }
  const onValuesChange = async (changedValues: any, allValues: any) => {
    if ('printMethod' in changedValues) {
      setIsSilkPrintPM(changedValues.printMethod === 'SilkPrintPM')
    }
    if ('edgeProcessParam' in changedValues) {
      setShowNeedDriverChip(
        changedValues.edgeProcessParam === 'LuminousStripOverLockEP'
      )
    }
    const watch = ['length', 'width', 'height']

    if (
      watch.find((find) => {
        return find in changedValues
      })
    ) {
      const { length, width, height, badRateParam, edgeProcessParam } =
        allValues
      if (length != null && width != null && height != null) {
        const {
          data: [StandardBAD, LuminousStripOverLockEP],
        } = await checkCompute({ length, width, height })

        setCheckData([StandardBAD, LuminousStripOverLockEP])

        if (StandardBAD.hasError) {
          if (badRateParam == null) {
            setBadRateParamDisabled(false)

            form.setFields([
              {
                name: 'badRateParam',
                errors: [StandardBAD.error],
              },
            ])
          }
        } else {
          setBadRateParamDisabled(true)
          form.setFields([
            {
              name: 'badRateParam',
              errors: [],
              //todo
            },
          ])
        }

        if (LuminousStripOverLockEP.hasError) {
          if (edgeProcessParam === 'LuminousStripOverLockEP') {
            form.setFields([
              {
                name: 'edgeProcessParam',
                errors: [LuminousStripOverLockEP.error],
              },
            ])
          }
        } else {
          form.setFields([
            {
              name: 'edgeProcessParam',
              errors: [],
            },
          ])
        }
      }
    }
  }
  useEffect(() => {
    form.setFieldsValue({})
  }, [data])

  return (
    <div className="relative">
      <Form
        scrollToFirstError={true}
        onValuesChange={onValuesChange}
        form={form}
      >
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
              name="info"
              rules={[{ required: true }]}
            >
              <Input className="w-300" placeholder="旺旺、微信、客户名称等" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 3 }}
              label="客户精准定位"
              name="position"
              rules={[{ required: true }]}
            >
              <Input className="w-300" placeholder="C店、外贸公司、商超等" />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 3 }}
              label="客户价格"
              name="price"
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
                  labelCol={{ span: 8 }}
                  label="长"
                  name="length"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    addonAfter="CM"
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 8 }}
                  label="宽"
                  name="width"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    addonAfter="CM"
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 8 }}
                  label="厚"
                  name="height"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    addonAfter="MM"
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 8 }}
                  label="不良率"
                  name="badRateParam"
                  rules={[{ required: !badRateParamDisabled }]}
                >
                  <InputNumber
                    disabled={badRateParamDisabled}
                    min={0}
                    addonAfter="%"
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
                  name="size"
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
                  name="printMethod"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options.PrintMethod}
                  />
                </Form.Item>
                <Form.Item
                  label="边缘处理方式"
                  name="edgeProcessParam"
                  rules={[
                    {
                      required: true,
                      async validator(rule, value) {
                        if (!value) {
                          throw new Error('边缘处理方式不能为空')
                        }
                        if (
                          checkData?.[1].hasError &&
                          value === 'LuminousStripOverLockEP'
                        ) {
                          throw new Error(checkData?.[1].error)
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options.EdgeProcess}
                  />
                </Form.Item>
                <AnimatePresence>
                  {showNeedDriverChip && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Form.Item name="needDriverChip" valuePropName="checked">
                        <Checkbox>是否需要驱动芯片</Checkbox>
                      </Form.Item>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isSilkPrintPM && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="fi space-x-24">
                      <Form.Item
                        label="网板次数"
                        name="silkPrintCount"
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          min={0}
                          className="w-200"
                          placeholder="请输入内容"
                        />
                      </Form.Item>
                      <Form.Item
                        label="丝印次数"
                        name="stencilCount"
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          min={0}
                          className="w-200"
                          placeholder="请输入内容"
                        />
                      </Form.Item>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  name="materialParam"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options.mt}
                  />
                </Form.Item>
                <Form.Item
                  label="底料"
                  name="primerParam"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options.pr}
                  />
                </Form.Item>
              </div>

              <div className="text-#666 text-16 mb-12">辅料明细</div>
              {options.accy && (
                <Excel ref={excelRef} options={options.accy}></Excel>
              )}
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
                <Form.Item label="列" name="row" rules={[{ required: true }]}>
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item label="排" name="col" rules={[{ required: true }]}>
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item label="层" name="layer" rules={[{ required: true }]}>
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
              </div>

              {/* <div className="text-#666 text-16 mb-12">纸箱尺寸</div>
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
              </div> */}
            </div>
          </div>

          <div>
            <div className="divider mb-32">
              <div className="text-#666 inline-block text-20 fw-600 mb-12">
                物流运输
              </div>
            </div>
            <div className="pl-24">
              <div className="fi space-x-24">
                <Form.Item
                  label="运输方式"
                  name="freightParam"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options.fre}
                  />
                </Form.Item>
                {/* <Form.Item
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
              </Form.Item>*/}
              </div>
            </div>
          </div>

          <div>
            <div className="divider mb-32">
              <div className="text-#666 inline-block text-20 fw-600 mb-12">
                开票信息
              </div>
            </div>
            <div className="pl-24">
              <div className="fi space-x-24">
                {/* <Form.Item
                label="增值税发票"
                name="byclfs"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>*/}
                <Form.Item
                  rules={[{ required: true }]}
                  label="发票类型"
                  name="taxRateParam"
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options.tax}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

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
                onClick={onFinish}
                shape="round"
                size="large"
                htmlType="submit"
                type="primary"
                className="w-full"
              >
                提交
              </Button>
            </div>
          </div>
        </footer>
      </Form>
    </div>
  )
}
export default MainForm
