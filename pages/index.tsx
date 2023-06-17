import Image from 'next/image'
import { Inter } from 'next/font/google'
import useSWR from 'swr'
import { content } from '@/mock';

const inter = Inter({ subsets: ['latin'] })
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {

  const { data } = useSWR('api/summarg', fetcher)

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>原文</h1>
      {JSON.stringify(content)}
      <h1>总结后</h1>
      {JSON.stringify(data?.data)}
    </main>
  )
}
