import type { NextPage } from 'next'
import { getRoleList, getPageList, roleRlPage, delRoleRlPage } from '@/api'
type Role = unwrapResponse<typeof getRoleList>[number]
type RLPAGE = unwrapResponse<typeof getPageList>[number]

import FadeIn from '@/components/FadeIn'
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
  const onRlPageChange = async (
    roleId: number,
    checked: boolean,
    pageId: number,
    rlPageList: RLPAGE[]
  ) => {
    const rlPageIds = rlPageList.map((item) => item.id)
    const pageIds = checked
      ? [...rlPageIds, pageId]
      : rlPageIds.filter((id) => id !== pageId)

    await roleRlPage(roleId, { pageIds })
    initRoleList()
  }
  useEffect(() => {
    initPageList()
    initRoleList()
  }, [])

  return (
    <FadeIn>
      <Card bordered={false}>
        {/* <div className="linear-text shadow-login inline-block text-20 fw-600 mb-12">
        页面权限
      </div> */}
        <div className="space-y-24">
          {allRoleList.map(({ id: roleId, roleName, rlPageList }) => (
            <div key={roleId}>
              <div className="mb-8">{roleName}</div>
              {allPageList.map(({ id, pageCode, pageName }) => (
                <Tag.CheckableTag
                  checked={!!rlPageList?.find((find: RLPAGE) => find.id === id)}
                  onChange={(checked) =>
                    onRlPageChange(roleId, checked, id, rlPageList)
                  }
                  key={id}
                >
                  {pageName}
                </Tag.CheckableTag>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </FadeIn>
  )
}
export default Auth
