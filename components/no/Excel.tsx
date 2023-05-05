import { EditableProTable, ProFormField } from '@ant-design/pro-components'
import { Button } from 'antd'
import React, { useState } from 'react'

type DataSourceType = {
  id: React.Key
  title?: string
  decs?: string
  state?: string
  created_at?: string
  children?: DataSourceType[]
}

type Props = {
  options: Option[]
}
const Excel = ({ options }: Props) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    options.map((item) => item.value)
  )
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(() =>
    options.map(({ value, label }) => ({
      key: value,
      name: label,
      id: value,
      qty: undefined,
      price: undefined,
      material: undefined,
      size: undefined,
      print: undefined,
      other: undefined,
    }))
  )

  const columns: any[] = [
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
      editable: true,
      ellipsis: true,
    },
    {
      title: '材质',
      dataIndex: 'material',
      editable: true,
      ellipsis: true,
      required: true,
    },
    {
      title: '大小',
      dataIndex: 'size',
      editable: true,
      ellipsis: true,
      required: true,
    },
    {
      title: '印刷',
      dataIndex: 'print',
      editable: true,
      ellipsis: true,
      required: true,
    },
    {
      title: '其他要求',
      dataIndex: 'other',
      editable: true,
      ellipsis: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      editable: true,
      ellipsis: true,
    },
  ]

  return (
    <EditableProTable<DataSourceType>
      columns={columns}
      rowKey="id"
      scroll={{
        x: 960,
      }}
      value={dataSource}
      onChange={setDataSource}
      recordCreatorProps={false}
      editable={{
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
export default Excel
