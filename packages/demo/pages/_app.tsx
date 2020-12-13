import Head from 'next/head'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import '../styles/global.css'

function AzaDemo({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Aza: 日本の住所情報入力のインタフェースについて考える</title>
      <meta property="og:title" content="Aza: 日本の住所情報入力のインタフェースについて考える" />
      <meta name="author" content="@hmsk" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default AzaDemo
