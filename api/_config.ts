import { message } from 'antd'
import { ofetch } from 'ofetch'
import type { SearchParameters } from 'ofetch'
import userState from '@/store/user'
const fetch = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  retry: 0,
  async onRequest({ request, options }) {
    options.headers = Object.assign(options.headers || {}, {
      token: `Bearer ${userState?.token}`,
    })
  },
  async onResponseError({ request, response, options }) {
    response._data.message && message.error(response._data.message)
  },
  async onResponse({ request, response, options }) {
    if (response._data.message) {
      message.destroy()
      if (response._data.status) {
        message.success(response._data.message, 1)
      } else {
        message.warning(response._data.message, 1.5)
        return Promise.reject()
      }
    }
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

export const PUT = (
  resource: RequestInfo,
  body: SearchParameters,
  config?: RequestInit
) => fetch(resource, { method: 'PUT', body, ...config })

export const DELETE = (
  resource: RequestInfo,
  body: SearchParameters,
  config?: RequestInit
) => fetch(resource, { method: 'DELETE', body, ...config })
