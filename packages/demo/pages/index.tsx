import React, { FunctionComponent, useEffect, useState } from 'react'
import { AzaMetaWithName } from 'aza-meta'

const Index: FunctionComponent = () => {
  const [result, setResult] = useState<AzaMetaWithName[]>([])
  const [term, setTerm] = useState('白金台')

  useEffect(() => {
    fetch(`/api/search?term=${term}`)
      .then(res => res.json())
      .then(({ result }: { result: AzaMetaWithName[] }) => {
        setResult(result)
      })
  }, [term])

  return(
    <div>
      <h1>aza demo</h1>
      <input type="text" value={term} onChange={e => setTerm(e.currentTarget.value)} />
      <p>Total: {result.length}</p>
      <ul>
        { result.map(res => {
          return <li key={res.id}>{res.name}（{res.prefecture} {res.municipality}）</li>
        })}
      </ul>
    </div>
  )
}

export default Index
