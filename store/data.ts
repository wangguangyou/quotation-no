import { proxy } from 'valtio'

type Store = {
  statusList: { label: string; value: number }[]
}

class State {
  statusList = [
    {
      value: 0,
      label: '已报价',
    },
    {
      value: 20,
      label: '已报价-驳回',
    },
    {
      value: 10,
      label: '已重新报价',
    },
    {
      value: 100,
      label: '已完善', //10 +complete
    },
    {
      value: 11,
      label: '已重新完善',
    },
    {
      value: 21,
      label: '已完善-驳回',
    },
    {
      value: 30,
      label: '已完成',
    },
  ]
}
const state = proxy<Store>(new State())

export default state
