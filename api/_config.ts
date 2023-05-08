import { message } from 'antd'
import { ofetch } from 'ofetch'
import type { SearchParameters } from 'ofetch'
import userState from '@/store/user'
import Router from 'next/router'
const fetch = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  retry: 0,
  async onRequest({ request, options }) {
    options.headers = Object.assign(options.headers || {}, {
      Authorization: `Bearer ${(await userState.user)?.token}`,
    })
  },
  async onResponse({ request, response, options }) {
    if (response.status === 401) {
      message.destroy()
      userState.user = null
      message.warning('用户信息已过期，请重新登录')
      Router.push('/login')
      return Promise.reject()
    }

    if (!options.silence && response._data.message) {
      // message.destroy()
      if (response._data.status) {
        message.success(response._data.message, 1.5)
      } else {
        message.warning(response._data.message, 2)
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
) => fetch(resource, { method: 'post', body, ...config })

export const PUT = (
  resource: RequestInfo,
  body: SearchParameters,
  config?: RequestInit
) => fetch(resource, { method: 'put', body, ...config })

export const DELETE = (
  resource: RequestInfo,
  params: SearchParameters,
  config?: RequestInit
) => fetch(resource, { method: 'delete', params, ...config })
