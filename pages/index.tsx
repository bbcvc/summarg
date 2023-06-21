import Image from 'next/image'
import { Inter } from 'next/font/google'
import useSWR from 'swr'
import { content } from '@/mock';

const inter = Inter({ subsets: ['latin'] })
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {

  const { data, isLoading } = useSWR('api/summarg', fetcher)

  return (
    <div className='p-6'>
      <div className='text-2xl text-center pb-6'>
        <h1>基于langchain的文章总结，langchain + nestjs + ioredis(upstash) + PostgreSQL(supabase) + tailwindcss</h1>
      </div>
      <main
        className={`flex min-h-screen flex-col items-center pb-6 ${inter.className}`}
      >
        <h2 className='pb-3 text-xl'>原文</h2>
        {JSON.stringify(content)}
        <h2 className='py-3 text-xl'>总结后</h2>
        {isLoading ? <h1>loading...</h1> : <div>{JSON.stringify(data?.data)}</div>}
      </main>
    </div>
  )
}
