import type { NextPage } from 'next'
import { getRoleList, getPageList } from '@/api'
import type { Role, RLPAGE } from '@/types'

import { Card, Form, Input, Button, Table, Tag, Modal } from 'antd'
import { useEffect, useState } from 'react'

const Auth: NextPage = () => {
  const [allRoleList, setRoleList] = useState<Role[]>([])
  const [allPageList, setPageList] = useState<RLPAGE[]>([])

  const initPageList = async () => {
    const { data } = await getPageList()
    setPageList(data)
  }
  const initRoleList = async () => {
    const { data } = await getRoleList()
    setRoleList(data)
  }
  useEffect(() => {
    initPageList()
    initRoleList()
  }, [])

  return (
    <Card bordered={false}>
      <div className="space-y-24">
        {allRoleList.map(({ id, roleName, rlPageList }) => (
          <div key={id}>
            <div className="mb-8">{roleName}</div>
            {allPageList.map(({ id, pageCode, pageName }) => (
              <Tag.CheckableTag
                checked={!!rlPageList?.find((find: RLPAGE) => find.id === id)}
                // onChange={(checked) => onRoleChange(id, checked, record)}
                key={id}
              >
                {pageName}
              </Tag.CheckableTag>
            ))}
          </div>
        ))}
      </div>
    </Card>
  )
}
export default Auth
