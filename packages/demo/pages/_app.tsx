import { AppProps } from 'next/dist/next-server/lib/router/router'
import '../styles/global.css'

function AzaDemo({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default AzaDemo
