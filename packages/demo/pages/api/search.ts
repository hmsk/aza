import { NextApiRequest, NextApiResponse } from 'next'
import { search } from 'aza-meta'

export default (req: NextApiRequest, res: NextApiResponse): void => {
  const responseName = req.query?.term
  if (responseName && !Array.isArray(responseName)) {
    res.status(200).json({ result: search(responseName) })
  } else {
    res.status(400).json({ result: [] })
  }
}
