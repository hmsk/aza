import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/global.css'

const AzaDemo:React.FC<AppProps> = ({ Component, pageProps }) => {
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
