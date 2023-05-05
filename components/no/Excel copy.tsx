import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import type { InputRef } from 'antd'
import { Form, Input, Table } from 'antd'
import type { FormInstance } from 'antd/es/form'

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface Item {
  key: React.Key
  id: number
  name: string
  qty: number
  price: number
  material: string
  size: string
  print: string
  other: string
}
interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form size="small" form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  required?: boolean
  children: React.ReactNode
  dataIndex: keyof Item
  record: Item
  handleSave: (record: Item) => void
}
type EditableCellRef = {
  validator: () => Promise<any>
}
const EditableCell = forwardRef<EditableCellRef, EditableCellProps>(
  (
    {
      title,
      required,
      editable,
      children,
      dataIndex,
      record,
      handleSave,
      ...restProps
    },
    ref
  ) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef<InputRef>(null)
    const form = useContext(EditableContext)!

    useImperativeHandle(ref, () => ({
      async validator() {
        if (!record[dataIndex]) {
          setEditing(true)
          return form.validateFields()
        }
        return Promise.resolve()
      },
    }))

    useEffect(() => {
      if (editing) {
        inputRef.current!.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
      try {
        const values = await form.validateFields([dataIndex])

        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        // console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required,
              message: `${title}不能为空`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ padding: '5px 12px' }}
          onClick={() => !editing && toggleEdit()}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }
)
EditableCell.displayName = 'EditableCell'
type EditableTableProps = Parameters<typeof Table>[0]

type DataType = Partial<Item>

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

type Props = {
  options: Option[]
}
type Ref = {
  dataSource: DataType[]
  validator: () => Promise<any>
} | null
const Component = forwardRef<Ref, Props>(({ options }, ref) => {
  // const editableCellRef = useRef<React.ElementRef<typeof EditableCell>>(null)
  const editableCellRef = useRef<React.ElementRef<typeof EditableCell>[]>([])

  const [dataSource, setDataSource] = useState<DataType[]>(
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
  useImperativeHandle(ref, () => ({
    dataSource,
    validator() {
      const a = editableCellRef.current!.map((ref) => {
        return ref?.validator()
      })
      console.log(a)
      return Promise.all(a)
        .then((arr) => console.log(arr))
        .catch((...args) => {
          console.log(args)
        })
    },
  }))
  const defaultColumns: (ColumnTypes[number] & {
    required?: boolean
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: '序号',
      dataIndex: 'name',
      width: 80,
      render: (_, __, index) => index + 1,
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
    // {
    //   title: '辅料产品单价',
    //   dataIndex: 'f',
    //   editable: true,
    //   ellipsis: true,
    // },
    // {
    //   title: '产品数量',
    //   dataIndex: 'f',
    //   editable: true,
    //   ellipsis: true,
    // },
  ]

  const handleSave = (row: DataType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: (props: any) => (
        <EditableCell
          {...props}
          ref={(r) => {
            props.required && editableCellRef.current.push(r!)
          }}
        ></EditableCell>
      ),
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        required: col.required,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <Table
      tableLayout="fixed"
      size="small"
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource}
      columns={columns as ColumnTypes}
      pagination={false}
    />
  )
})

Component.displayName = 'Excel'
export default Component
