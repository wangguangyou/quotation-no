import { Quotation, AccyItem } from './types'
export default interface Detail {
  quotation: Quotation
  computeResult: ComputeResult
  opRecords: OpRecord[]
  quotationPackage: QuotationPackage
  accyList: AccyItem[]
  tax: string
  transport: string
}
interface QuotationPackage {
  id: number
  quotedId: number
  row: number
  col: number
  layer: number
  volume: number
  weight: number
  pcs: number
  createTime: string
}

interface OpRecord {
  id: number
  userId: number
  quotedId: number
  opCode: number
  opDesc: string
  opTime: string
  nickname: string
  username: string
}

interface ComputeResult {
  unitResult: UnitResult[]
  fixParam: FixParam
  finalPrice: number
  finalTaxPrice: number
}

interface FixParam {
  PrimerEdgeMaterial01: number
  PrimerEdgeMaterial02: number
  PrimerBottomMaterial: number
  PrintLaborCost: number
}

interface UnitResult {
  value: number
  typeName: string
  typeCode: string
  unitCode: string
  unitName: string
}
