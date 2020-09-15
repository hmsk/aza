import { NextApiRequest, NextApiResponse } from 'next'
import { search } from 'aza-meta'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const responseName = req.query?.term || 'John Doe'
  res.status(200).json({ result: search(Array.isArray(responseName) ? responseName[0] : responseName).slice(0, 5) })
}
