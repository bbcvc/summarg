import Image from 'next/image'
import { Inter } from 'next/font/google'
import hash from 'object-hash'
import { ChangeEvent, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [originPost, setOriginPost] = useState('')
  const [res, setRes] = useState('')
  // 获取路由信息
  const slug = 'cl'


  const getSummarg = async (content: string) => {
    const response = await fetch('api/summarg', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(
        {
          hashKey: hash({ slug, content }),
          slug: slug,
          content: content,
        }
      )
    })
    const { data } = await response.json()
    setRes(data)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      // 文件里的文本会在这里被打印出来
      const txt = event?.target?.result
      setOriginPost(txt as string)
      getSummarg(txt as string)
    };
    reader.readAsText(file!);
  }

  return (
    <div className='p-6'>
      <div className='text-2xl text-center pb-6'>
        <h1>基于langchain的文章总结，langchain + nestjs + ioredis(upstash) + PostgreSQL(supabase) + tailwindcss</h1>
      </div>
      <main
        className={`flex min-h-screen flex-col items-center pb-6 ${inter.className}`}
      >
        <h2 className='pb-3 text-xl'>原文</h2>
        <input type='file' onChange={(e) => onChange(e)} />
        <pre>
          {originPost}
        </pre>
        <h2 className='py-3 text-xl'>总结后</h2>
        <div>{res}</div>
      </main>
    </div>
  )
}
