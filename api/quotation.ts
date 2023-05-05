import { GET, POST, PUT, DELETE } from './_config'
import { Quotation } from './types'

export const getQuotationPage = (
  data?: any
): JavaResponsePagination<Quotation[]> => GET('/quotation/page', data)

export const addQuotation = (data: any) => POST('/quotation/create', data)

export const editQuotation = (id: Quotation['id'], data: any) =>
  PUT(`/quotation/update/${id}`, data)

export const delQuotation = (id: Quotation['id'], data?: any) =>
  DELETE(`/quotation/delete/${id}`, data)
