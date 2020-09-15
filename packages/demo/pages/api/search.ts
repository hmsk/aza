import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const responseName = req.query?.term || 'John Doe'
  res.status(200).json({ name: responseName })
}
