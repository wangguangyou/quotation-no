import '@/styles/globals.css'
import '@unocss/reset/normalize.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

import Head from 'next/head'
import Layout from '@/components/layout'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  noLayout?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <>
      <Head>
        <title>宁波品印智能报价软件</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {},
        }}
      >
        <Layout noLayout={Component.noLayout}>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
    </>
  )
}
