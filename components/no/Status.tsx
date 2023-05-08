import { Quotation } from '@/api/types'
import { Badge } from 'antd'
import dataState from '@/store/data'
import { useSnapshot } from 'valtio'

type BadgeProps = React.ComponentProps<typeof Badge>

const Status = ({ record }: { record: Quotation }) => {
  const state = useSnapshot(dataState)
  const getBadgeStatus = (record: Quotation) => {
    const { quotedStatus } = record
    return ({ 21: 'warning', 20: 'warning', 30: 'success' }[
      String(quotedStatus)
    ] || 'processing') as BadgeProps['status']
  }

  return (
    <Badge
      status={getBadgeStatus(record)}
      text={state.getLabel(
        record.buyer && [0, 10].includes(record.quotedStatus)
          ? 100
          : record.quotedStatus
      )}
    />
  )
}

export default Status
