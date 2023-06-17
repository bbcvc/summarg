// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSummarg } from '@/lib/getSummary'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await getSummarg()
  console.log('getSummarg', data);
  res.status(200).json({ name: data?.text})
}
