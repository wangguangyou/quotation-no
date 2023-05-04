import { GET, POST, PUT, DELETE } from './_config'
import { Quotation } from './types'

export const getQuotationPage = (
  data?: any
): JavaResponsePagination<Quotation[]> => GET('/quotation/page', data)

export const addQuotation = (data: Omit<Quotation, 'id'>) =>
  POST('/quotation/add', data)

export const editQuotation = (
  id: Quotation['id'],
  data: Omit<Quotation, 'id'>
) => PUT(`/quotation/update/${id}`, data)

export const delQuotation = (id: Quotation['id'], data?: any) =>
  DELETE(`/quotation/delete/${id}`, data)
