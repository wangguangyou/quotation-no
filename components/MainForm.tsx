import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Checkbox,
  Alert,
  message,
} from 'antd'
import AuthWrap from '@/components/AuthWrap'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getSubComputeUnit, checkCompute } from '@/api'
import { getQuotationParam } from '@/api/quotation'
import { addQuotation } from '@/api/quotation'
import userState from '@/store/user'
import { useSnapshot } from 'valtio'
type QuotationParam = unwrapResponse<typeof getQuotationParam>
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
  const isEditMode = !!data
  const state = useSnapshot(userState)
  const [messageApi, contextHolder] = message.useMessage()
  const excelRef = useRef<ExcelHandle>(null)
  const [form] = Form.useForm()
  const [options, setOptions] = useState<Record<string, any>>({})
  const [checkData, setCheckData] =
    useState<unwrapResponse<typeof checkCompute>>()
  const [badRateParamDisabled, setBadRateParamDisabled] = useState(true)
  const [showNeedDriverChip, setShowNeedDriverChip] = useState(false)
  const [isSilkPrintPM, setIsSilkPrintPM] = useState(false)
  const [alone, setAlone] = useState(false)
  const [key, setKey] = useState(0)
  const [excelData, setExcelData] = useState<
    QuotationParam['accyParam']['accyItemList']
  >([])

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
    const [values, accyItemList] = await Promise.all([
      form.validateFields(),
      excelRef.current!.validator(),
    ])

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
      clerkComplete: alone,
      length,
      width,
      height,
      size,
      printMethod:
        printMethod == null
          ? null
          : {
              code: printMethod,
              stencilCount, // ⽹板次数
              silkPrintCount, // 丝印次数
            },
      packageParam: {
        row,
        col,
        layer,
      },
      materialParam:
        materialParam == null
          ? null
          : {
              mapId: materialParam,
            },
      freightParam:
        freightParam == null
          ? null
          : {
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
      edgeProcessParam:
        edgeProcessParam == null
          ? null
          : {
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
    const { status } = await addQuotation(params)
    if (status) {
      messageApi.open({
        type: 'success',
        content: '操作成功',
      })
      setKey(Date.now())
      // excelRef.current!.resetFields()
      form.resetFields()
    }
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
    const watch = ['length', 'width', 'height', 'size']

    if (
      watch.find((find) => {
        return find in changedValues
      })
    ) {
      if ('size' in changedValues) {
        if (checkData?.[0].hasError) return
      }
      const { length, width, height, size, badRateParam, edgeProcessParam } =
        allValues
      if (length != null && width != null && height != null) {
        const {
          data: [StandardBAD, LuminousStripOverLockEP],
        } = await checkCompute({ length, width, height, size })

        setCheckData([StandardBAD, LuminousStripOverLockEP])

        if (StandardBAD.hasError) {
          setBadRateParamDisabled(false)
          form.setFields([
            {
              name: 'badRateParam',
              errors: [StandardBAD.error],
              value: undefined,
            },
          ])
        } else {
          setBadRateParamDisabled(true)
          form.setFields([
            {
              name: 'badRateParam',
              errors: [],
              value: StandardBAD.value,
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
    ;(async () => {
      const { data: raw } = await getQuotationParam(data.id)
      setExcelData(raw.accyParam.accyItemList)
      form.setFieldsValue({
        info: raw.customerParam.info,
        position: raw.customerParam.position,
        price: raw.customerParam.price,
        size: raw.size,
        length: raw.length,
        width: raw.width,
        height: raw.height,
        printMethod: raw.printMethod.code,
        edgeProcessParam: raw.edgeProcessParam.code,
        materialParam: raw.materialParam.mapId,
        primerParam: raw.primerParam.mapId,
        col: raw.packageParam.col,
        row: raw.packageParam.row,
        layer: raw.packageParam.layer,
        taxRateParam: raw.taxRateParam.mapId,
        badRateParam: raw.badRateParam.inputRate,
        freightParam: raw.freightParam.mapId,
      })
    })()
  }, [data])

  return (
    <div className="relative">
      {contextHolder}
      {!isEditMode && (
        <AuthWrap auth="alone-create">
          <Alert
            className="w-400 mb-24"
            showIcon
            message="选择是否独自完成全流程"
            type={alone ? 'success' : 'info'}
            action={
              <Checkbox
                checked={alone}
                onChange={({ target: { checked } }) => setAlone(checked)}
              >
                确定
              </Checkbox>
            }
          />
        </AuthWrap>
      )}
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
                    max={100}
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
              {options.accy && (!isEditMode || excelData) && (
                <Excel
                  data={excelData}
                  key={key}
                  requireds={['print', 'material', 'size'].concat(
                    alone || state.isBuyer ? ['price'] : []
                  )}
                  ref={excelRef}
                  options={options.accy}
                ></Excel>
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
                // htmlType="submit"
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
