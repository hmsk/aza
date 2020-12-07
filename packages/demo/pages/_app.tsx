import { AppProps } from 'next/dist/next-server/lib/router/router'
import 'tailwindcss/tailwind.css'

function AzaDemo({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default AzaDemo
