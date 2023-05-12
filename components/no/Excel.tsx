import { EditableProTable, ProFormField } from '@ant-design/pro-components'
import { Form } from 'antd'
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import type {
  EditableFormInstance,
  ProColumns,
} from '@ant-design/pro-components'
import type { AccyItem } from '@/api/types'
type DataSourceType = Partial<AccyItem>

type Props = {
  parentValues?: Record<string, any>
  options: Option[]
  data?: AccyItem[]
  requireds?: string[]
  onExcelValuesChange?: (data: any) => void
}
type EditableCellRef = {
  validator: () => Promise<DataSourceType[]>
  resetFields: () => Promise<void>
  getRowsData: () => any
}

const Excel = forwardRef<EditableCellRef, Props>(
  ({ options, requireds, data, onExcelValuesChange, parentValues }, ref) => {
    const [form] = Form.useForm()

    const editorFormRef = useRef<EditableFormInstance<DataSourceType>>()
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
      options.map((item) => item.value)
    )
    useImperativeHandle(ref, () => ({
      async validator() {
        return editorFormRef.current.validateFields().then(() => dataSource)
      },
      async resetFields() {
        form.resetFields()
      },
      getRowsData() {
        return dataSource
        return editorFormRef.current.getRowsData()
      },
    }))

    // useEffect(() => {
    //   data?.forEach((item: DataSourceType, index) => {
    //     editorFormRef.current.setRowData(index, item)
    //   })
    // }, [data])
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(
      () => {
        if (data) {
          return data.map((item, index) => ({ ...item, id: index + 1 }))
        }
        return options.map(({ value, label }) => {
          const ret: DataSourceType = {
            name: label,
            id: +value,
            qty: undefined,
            price: undefined,
            material: undefined,
            size: undefined,
            print: undefined,
            other: undefined,
          }
          return ret
        })
      }
    )

    const columns: ProColumns<DataSourceType>[] = [
      {
        title: '序号',
        dataIndex: 'name',
        editable: false,
        width: 80,
        render: (_: any, __: any, index: any) => index + 1,
      },
      {
        title: '产品名称',
        dataIndex: 'name',
        ellipsis: true,
        formItemProps: () => {
          return {
            rules: [{ required: requireds?.includes('name') }],
          }
        },
      },
      {
        title: '数量',
        dataIndex: 'qty',
        ellipsis: true,
        formItemProps: () => {
          return {
            rules: [{ required: requireds?.includes('qty') }],
          }
        },
      },
      {
        title: '材质',
        dataIndex: 'material',
        ellipsis: true,
        formItemProps: () => {
          return {
            rules: [{ required: requireds?.includes('material') }],
          }
        },
      },
      {
        title: '大小',
        dataIndex: 'size',
        ellipsis: true,
        formItemProps: () => {
          return {
            rules: [{ required: requireds?.includes('size') }],
          }
        },
      },
      {
        title: '印刷',
        dataIndex: 'print',
        ellipsis: true,
        formItemProps: () => {
          return {
            rules: [{ required: requireds?.includes('print') }],
          }
        },
      },
      {
        title: '其他要求',
        dataIndex: 'other',
        ellipsis: true,
        formItemProps: () => {
          return {
            rules: [{ required: requireds?.includes('other') }],
          }
        },
      },
      {
        title: '价格',
        dataIndex: 'price',
        valueType: 'digit',
        ellipsis: true,
        formItemProps: () => {
          return {
            rules: [{ required: requireds?.includes('price') }],
          }
        },
      },
      {
        title: '辅料产品单价',
        editable: false,
        ellipsis: true,
        render: (_, record) => {
          const { qty, price } = record
          if (!qty || !price || !parentValues?.size) return '-'
          return (qty / parentValues.size) * price
        },
      },
      {
        title: '操作',
        valueType: 'option',
        width: 80,
        render: () => {
          return null
        },
      },
    ]

    return (
      <EditableProTable<DataSourceType>
        editableFormRef={editorFormRef}
        columns={columns}
        rowKey="id"
        scroll={{
          x: 960,
        }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
          }),
        }}
        editable={{
          form,
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete]
          },
          editableKeys,
          onValuesChange: (record: any, recordList: any) => {
            setDataSource(recordList)
            onExcelValuesChange?.(recordList)
          },
          onChange: setEditableRowKeys,
        }}
      />
    )
  }
)

Excel.displayName = 'Excel'
export default Excel
