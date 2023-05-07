export default interface ComputedResult {
  unitResult: UnitResult[]
  fixParam: FixParam
  finalPrice: number
  finalTaxPrice: number
}

interface FixParam {
  PrimerEdgeMaterial01: number
  PrimerBottomMaterial: number
  PrimerEdgeMaterial02: number
  PrintLaborCost: number
}

interface UnitResult {
  value: number
  typeName: string
  typeCode: string
  unitCode: string
  extendData?: ExtendDatum | boolean
}

interface ExtendDatum {
  volume: number
  weight: number
  pcs: number
}
