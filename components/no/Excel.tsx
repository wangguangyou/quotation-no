import { EditableProTable, ProFormField } from '@ant-design/pro-components'
import { Form } from 'antd'
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import type {
  EditableFormInstance,
  ProColumns,
} from '@ant-design/pro-components'
import type { AccyItem } from '@/api/types'
type DataSourceType = Partial<AccyItem>

type Props = {
  options: Option[]
  data?: AccyItem[]
  requireds?: string[]
}
type EditableCellRef = {
  validator: () => Promise<DataSourceType[]>
  resetFields: () => Promise<void>
}

const Excel = forwardRef<EditableCellRef, Props>(
  ({ options, requireds, data }, ref) => {
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
    }))

    const defaultData = options.map(({ value, label }) => {
      const find = data?.find((find) => find.id === value)
      const ret: DataSourceType = {
        name: label,
        id: value,
        qty: undefined,
        price: undefined,
        material: undefined,
        size: undefined,
        print: undefined,
        other: undefined,
      }
      if (find) {
        Object.assign(ret, {
          ...find,
        })
      }
      return ret
    })
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(
      () => defaultData
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
        editable: false,
        ellipsis: true,
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
        recordCreatorProps={false}
        editable={{
          form,
          type: 'multiple',
          editableKeys,
          onValuesChange: (record: any, recordList: any) => {
            setDataSource(recordList)
          },
          onChange: setEditableRowKeys,
        }}
      />
    )
  }
)

Excel.displayName = 'Excel'
export default Excel
