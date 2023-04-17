import { message } from 'antd'
import { ofetch } from 'ofetch'
import type { SearchParameters } from 'ofetch'

const fetch = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  async onRequest({ request, options }) {
    options.headers = Object.assign(options.headers || {}, { token: '' })
  },
  async onResponseError({ request, response, options }) {
    response._data.message && message.error(response._data.message)
  },
  async onResponse({ request, response, options }) {
    response._data.message && message.success(response._data.message)
  },
})

export const GET = (
  resource: RequestInfo,
  params: SearchParameters,
  config?: RequestInit
) => fetch(resource, { params, ...config })

export const POST = (
  resource: RequestInfo,
  body: SearchParameters,
  config?: RequestInit
) => fetch(resource, { method: 'POST', body, ...config })
