// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSummarg } from '@/lib/getSummary'
import { post } from '@/mock'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await getSummarg(post)

  res.status(200).json({ data: data!})
}
