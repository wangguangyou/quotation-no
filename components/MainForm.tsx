import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Checkbox,
  Radio,
  message,
  Spin,
} from 'antd'
import AuthWrap from '@/components/AuthWrap'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { checkCompute, combCompute } from '@/api'
import { getQuotationParam } from '@/api/quotation'
import { addQuotation, editQuotation } from '@/api/quotation'
import userState from '@/store/user'
import dataState from '@/store/data'
import { useSnapshot } from 'valtio'
import type { Store as DataStoreType } from '@/store/data'
type QuotationParam = unwrapResponse<typeof getQuotationParam>

import Excel from '@/components/no/Excel'
type ExcelHandle = React.ElementRef<typeof Excel>

const MainForm = ({
  data,
  afterEdit,
}: {
  data?: any
  afterEdit?: () => void
}) => {
  const isEditMode = !!data
  const state = useSnapshot(userState)
  const hotDataState = useSnapshot(dataState)
  const [messageApi, contextHolder] = message.useMessage()
  const excelRef = useRef<ExcelHandle>(null)
  const [form] = Form.useForm()
  const [options, setOptions] = useState<DataStoreType['options']>()
  const [checkData, setCheckData] =
    useState<unwrapResponse<typeof checkCompute>>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [badRateParamDisabled, setBadRateParamDisabled] = useState(true)
  const [showNeedDriverChip, setShowNeedDriverChip] = useState(false)
  const [isSilkPrintPM, setIsSilkPrintPM] = useState(false)
  const [alone, setAlone] = useState(!isEditMode)
  const [allValues, setAllValues] = useState<Record<string, any>>()
  const [total, setTotal] = useState<number>()
  const [key, setKey] = useState(0)
  const [excelData, setExcelData] =
    useState<QuotationParam['accyParam']['accyItemList']>()

  useEffect(() => {
    ;(async () => {
      setOptions(await hotDataState.initOptions())
    })()
  }, [])

  const getParams = (values: any, accyItemList: any) => {
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
      weight,
      volume,
      pcs,
      taxRateParam,
      freightParam,
      shippingPayment,
      placement,
      boxLength,
      boxWidth,
      boxHeight,
      cartonLength,
      cartonWidth,
      cartonHeight,
      freight,
    } = values
    return {
      placement,
      freight,
      shippingPayment,
      clerkComplete: alone,
      length,
      width,
      height,
      size,
      printMethod:
        printMethod == '0'
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
        weight,
        volume,
        pcs,

        boxLength,
        boxWidth,
        boxHeight,
        length: cartonLength,
        width: cartonWidth,
        height: cartonHeight,
      },
      freightParam: {
        mapId: freightParam,
      },
      materialParam:
        materialParam == '0'
          ? null
          : {
              mapId: materialParam,
            },
      primerParam:
        primerParam == '0'
          ? null
          : {
              mapId: primerParam,
            },
      taxRateParam: {
        mapId: taxRateParam,
      },
      badRateParam: {
        inputRate: badRateParam,
      },
      edgeProcessParam:
        edgeProcessParam == '0'
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
  }
  const onClearAccy = () => {
    excelRef.current!.setRowsData([])
  }
  const onFinish = async () => {
    setSubmitLoading(true)
    try {
      const [values, accyItemList] = await Promise.all([
        form.validateFields(),
        excelRef.current!.validator(),
      ])

      const params = getParams(values, accyItemList)
      const { status } = await (isEditMode
        ? editQuotation(data.id, params)
        : addQuotation(params))
      if (status) {
        messageApi.open({
          type: 'success',
          content: '操作成功',
        })

        if (isEditMode) {
          return afterEdit?.()
        }

        setKey(Date.now())
        setTotal(undefined)
        form.resetFields()
      }
    } finally {
      setSubmitLoading(false)
    }
  }
  const initTotal = (values: any, excelData?: any) => {
    if (!alone) {
      return
    }
    const { size, length, width, height } = values
    size &&
      length &&
      width &&
      height &&
      combCompute(excelData ? getParams(values, excelData) : values)
        .then(({ data: { finalTaxPrice } }) => {
          setTotal(finalTaxPrice * size)
        })
        .catch(() => void 0)
  }
  const onExcelValuesChange = async (excelData: any) => {
    initTotal(form.getFieldsValue(), excelData)
  }

  const setBoxDefault = (values: any) => {
    const {
      volume,
      pcs,
      weight,
      length: cartonLength,
      width: cartonWidth,
      height: cartonHeight,
    } = values
    // const {
    //   row,
    //   col,
    //   layer,
    //   materialParam,
    //   primerParam,
    //   length,
    //   width,
    //   height,
    //   size,
    //   badRateParam,
    //   edgeProcessParam,
    //   boxLength,
    //   boxWidth,
    //   boxHeight,
    // } = allValues

    if (!form.isFieldsTouched(['cartonLength'])) {
      cartonLength && form.setFieldValue('cartonLength', cartonLength)
    }
    if (!form.isFieldsTouched(['cartonWidth'])) {
      cartonWidth && form.setFieldValue('cartonWidth', cartonWidth)
    }
    if (!form.isFieldsTouched(['cartonHeight'])) {
      cartonHeight && form.setFieldValue('cartonHeight', cartonHeight)
    }
  }
  const onValuesChange = async (changedValues: any, allValues: any) => {
    setAllValues(allValues)
    initTotal(allValues, excelRef.current?.getRowsData())

    if ('printMethod' in changedValues) {
      setIsSilkPrintPM(changedValues.printMethod === 'SilkPrintPM')
    }
    if ('edgeProcessParam' in changedValues) {
      setShowNeedDriverChip(
        changedValues.edgeProcessParam === 'LuminousStripOverLockEP'
      )
    }
    const watch = [
      'length',
      'width',
      'height',
      'size',
      'placement',
      'row',
      'col',
      'layer',
      'materialParam',
      'primerParam',
      'boxLength',
      'badRateParam',
      'boxWidth',
      'boxHeight',
    ]
    const {
      row,
      col,
      layer,
      materialParam,
      primerParam,
      length,
      width,
      height,
      size,
      badRateParam,
      edgeProcessParam,
      placement,
      boxLength,
      boxWidth,
      boxHeight,
    } = allValues

    if (
      watch.find((find) => {
        return find in changedValues
      })
    ) {
      try {
        if (length != null && width != null && height != null) {
          const {
            data: [StandardBAD, LuminousStripOverLockEP, StandardPKG],
          } = await checkCompute({
            length,
            width,
            height,
            placement,
            size,

            badRateParam: { inputRate: badRateParam },
            packageParam: {
              row,
              col,
              layer,

              boxLength,
              boxWidth,
              boxHeight,
            },
            materialParam:
              materialParam == '0'
                ? null
                : {
                    mapId: materialParam,
                  },
            primerParam:
              primerParam == '0'
                ? null
                : {
                    mapId: primerParam,
                  },
          })

          setCheckData([StandardBAD, LuminousStripOverLockEP, StandardPKG])
          if (StandardPKG?.value) {
            const {
              volume,
              pcs,
              weight,
              length: cartonLength,
              width: cartonWidth,
              height: cartonHeight,
            } = StandardPKG.value as any
            setBoxDefault(StandardPKG.value)

            form.setFields([
              {
                name: 'weight',
                errors: [],
                value: weight || undefined,
              },
              {
                name: 'pcs',
                errors: [],
                value: pcs,
              },
              {
                name: 'volume',
                errors: [],
                value: volume,
              },
            ])
          }

          if (
            ['lenght', 'width', 'height'].find((find) => {
              return find in changedValues
            })
          ) {
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

          if (
            ['lenght', 'width', 'height', 'size'].find((find) => {
              return find in changedValues
            })
          ) {
            if ('size' in changedValues) {
              if (checkData?.[0].hasError) return
            }
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
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  useEffect(() => {
    ;(async () => {
      if (data) {
        const { data: raw } = await getQuotationParam(data.id)
        initTotal(raw)
        setExcelData(raw.accyParam.accyItemList)
        form.setFieldsValue({
          info: raw.customerParam.info,
          position: raw.customerParam.position,
          price: raw.customerParam.price,
          size: raw.size,
          length: raw.length,
          width: raw.width,
          height: raw.height,
          printMethod: raw.printMethod?.code || '0',
          placement: raw.placement,
          shippingPayment: raw.shippingPayment,
          edgeProcessParam: raw.edgeProcessParam?.code || '0',
          materialParam: raw.materialParam?.mapId || 0,
          primerParam: raw.primerParam?.mapId || 0,
          col: raw.packageParam.col,
          row: raw.packageParam.row,
          layer: raw.packageParam.layer,
          weight: raw.packageParam.weight,
          volume: raw.packageParam.volume,
          pcs: raw.packageParam.pcs,
          taxRateParam: raw.taxRateParam.mapId,
          badRateParam: raw.badRateParam.inputRate,
          freightParam: raw.freightParam.mapId,
          freight: raw.freight,
          boxLength: raw.packageParam.boxLength,
          boxWidth: raw.packageParam.boxWidth,
          boxHeight: raw.packageParam.boxHeight,
          cartonLengthLength: raw.packageParam.length,
          cartonLengthWidth: raw.packageParam.width,
          cartonLengthHeight: raw.packageParam.height,
        })
      }
    })()
  }, [data])

  return (
    <div className="relative">
      {contextHolder}

      <Form
        scrollToFirstError={true}
        onValuesChange={onValuesChange}
        form={form}
      >
        <div className="pb-110 space-y-32">
          {!isEditMode && (
            <AuthWrap auth="alone-create">
              <div>
                <div className="divider mb-32">
                  <div className="text-#666 inline-block text-20 fw-600 mb-12">
                    报价单完成形式
                  </div>
                </div>
                <Radio.Group
                  options={[
                    { label: '个人', value: true },
                    { label: '团体', value: false },
                  ]}
                  onChange={({ target: { value } }) => setAlone(value)}
                  value={alone}
                />
              </div>
            </AuthWrap>
          )}

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

              <div className="fi flex-wrap space-x-24">
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

              <div className="fi flex-wrap space-x-24">
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
                    options={[{ value: '0', label: '无' } as any].concat(
                      options?.PrintMethod || []
                    )}
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
                    options={[{ value: '0', label: '无' } as any].concat(
                      options?.EdgeProcess || []
                    )}
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
                    options={[{ value: 0, label: '无' } as any].concat(
                      options?.mt || []
                    )}
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
                    options={[{ value: 0, label: '无' } as any].concat(
                      options?.pr || []
                    )}
                  />
                </Form.Item>
              </div>

              <div className="text-#666 text-16 mb-12">
                辅料明细
                <Button
                  onClick={onClearAccy}
                  type="primary"
                  className="float-right"
                >
                  清空
                </Button>
              </div>
              {options?.accy && (!isEditMode || excelData) && (
                <Excel
                  onExcelValuesChange={onExcelValuesChange}
                  data={excelData}
                  parentValues={allValues}
                  key={key}
                  requireds={['name'].concat(
                    alone || (isEditMode && !state.isClerk) ? ['price'] : []
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
                <Form.Item
                  label="摆放方式"
                  name="placement"
                  rules={[{ required: false }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options?.placement}
                  />
                </Form.Item>
              </div>

              <div className="text-#666 text-16 mb-12">纸箱尺寸</div>
              <div className="fi flex-wrap space-x-24">
                <Form.Item
                  labelCol={{ span: 8 }}
                  label="列"
                  name="row"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 8 }}
                  label="排"
                  name="col"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 8 }}
                  label="层"
                  name="layer"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
              </div>

              {allValues?.placement === 1 && (
                <div className="fi flex-wrap space-x-24">
                  <Form.Item
                    labelCol={{ span: 7 }}
                    label="盒子长"
                    name="boxLength"
                    rules={[{ required: false }]}
                  >
                    <InputNumber
                      min={0}
                      addonAfter="cm"
                      className="w-200"
                      placeholder="请输入内容"
                    />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 7 }}
                    label="盒子宽"
                    name="boxWidth"
                    rules={[{ required: false }]}
                  >
                    <InputNumber
                      min={0}
                      addonAfter="cm"
                      className="w-200"
                      placeholder="请输入内容"
                    />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 7 }}
                    label="盒子高"
                    name="boxHeight"
                    rules={[{ required: false }]}
                  >
                    <InputNumber
                      min={0}
                      addonAfter="cm"
                      className="w-200"
                      placeholder="请输入内容"
                    />
                  </Form.Item>
                </div>
              )}
              <div className="fi flex-wrap space-x-24">
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="纸箱长"
                  name="cartonLength"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    addonAfter="cm"
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="纸箱宽"
                  name="cartonWidth"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    addonAfter="cm"
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 7 }}
                  label="纸箱高"
                  name="cartonHeight"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    addonAfter="cm"
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
              </div>
              <div className="fi flex-wrap space-x-24">
                <Form.Item
                  label="整箱数量"
                  name="pcs"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    addonAfter="PSC"
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  label="整箱毛重"
                  name="weight"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    addonAfter="KG"
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  label="整箱体积"
                  name="volume"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    addonAfter="CBM(m³)"
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
            <div className="pl-24">
              <div className="fi flex-wrap space-x-24">
                <Form.Item
                  label="运输方式"
                  name="freightParam"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options?.fre}
                  />
                </Form.Item>
                <Form.Item
                  label="运费"
                  name="freight"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-200"
                    placeholder="请输入内容"
                  />
                </Form.Item>
                <Form.Item
                  label="运输付款方式"
                  name="shippingPayment"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="请选择"
                    className="w-200!"
                    options={options?.shippingPayment}
                  />
                </Form.Item>
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
                    options={options?.tax}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <footer
          className="h-110 absolute bottom-0 left-0 w-full flex items-center 
     "
        >
          <div>
            {alone && (
              <div className="flex items-center pl-24">
                <span className="text-18 text-#888 mr-16 align-text-bottom">
                  合计
                </span>

                <Spin spinning={!total} size="small">
                  <span className="linear-text inline-block text-40 fw-600">
                    {total && (
                      <>
                        <span className="text-32 v-text-bottom mb-2">￥</span>
                        {total.toFixed(2)?.toLocaleString()}
                      </>
                    )}
                  </span>
                </Spin>
              </div>
            )}

            <div className="mt-16 min-w-200">
              <Button
                onClick={onFinish}
                shape="round"
                loading={submitLoading}
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
