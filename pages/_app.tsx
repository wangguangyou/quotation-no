import '@unocss/reset/normalize.css'
import '@/styles/globals.css'
import { AnimatePresence, motion } from 'framer-motion'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Head from 'next/head'
import Layout from '@/components/layout'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
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
  const pathname = usePathname()
  return (
    <>
      <Head>
        <title>宁波品印智能报价软件</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <ConfigProvider
        form={{
          validateMessages: {
            required: () => '${label}不能为空',
          },
        }}
        input={{ autoComplete: 'off' }}
        locale={zhCN}
        theme={{}}
      >
        <Layout noLayout={Component.noLayout}>
          <AnimatePresence mode="wait">
            <motion.div
              className="h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: 'easeInOut' }}
              key={pathname}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </Layout>
      </ConfigProvider>
    </>
  )
}
