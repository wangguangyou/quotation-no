import { proxy } from 'valtio'
import { getSubComputeUnit } from '@/api'
import {
  getMtAll,
  getPrAll,
  getTaxAll,
  getFreAll,
  getAccyAll,
} from '@/api/param'

export type Store = {
  statusList: { label: string; value: number }[]
  getLabel: (value: number) => string | undefined
  options?: Record<string, Option[]>
  initOptions: () => Promise<Store['options']>
}

class State {
  options: Store['options']
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
      label: '已完善', //0+complete or 10 +complete
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
  getLabel(value: number) {
    return this.statusList.find((find) => find.value === value)?.label
  }

  async initOptions() {
    if (this.options) return this.options

    return Promise.all([
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
        return (this.options = {
          fre: fre.map(({ id, company }) => ({
            value: id,
            label: company,
          })),
          mt: [{ value: 0, label: '无' }].concat(
            mt.map(({ id, materialName }) => ({
              value: id,
              label: materialName,
            }))
          ),
          pr: [{ value: 0, label: '无' }].concat(
            pr.map(({ id, primerName }) => ({
              value: id,
              label: primerName,
            }))
          ),
          tax: tax.map(({ id, rateName }) => ({
            value: id,
            label: rateName,
          })),
          accy: accy.map(({ id, accyName }) => ({
            value: id,
            label: accyName,
          })),
          PrintMethod: [{ value: '0', label: '无' }].concat(
            PrintMethod.map(({ typeCode, typeName }) => ({
              value: typeCode,
              label: typeName,
            }))
          ),
          EdgeProcess: [{ value: '0', label: '无' }].concat(
            EdgeProcess.map(({ typeCode, typeName }) => ({
              value: typeCode,
              label: typeName,
            }))
          ),
        })
      }
    )
  }
}
const state = proxy<Store>(new State())

export default state
