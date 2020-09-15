import React, { FunctionComponent, useEffect, useState } from 'react'
import { AzaMetaWithName } from 'aza-meta'

const Index: FunctionComponent = () => {
  const [result, setResult] = useState<AzaMetaWithName[]>([])
  const [term, setTerm] = useState('')

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
      <input type="text" onChange={e => setTerm(e.target.value)} />
      <ul>
        { result.map(res => {
          return <li key={res.id}>{res.id} - {res.name}</li>
        })}
      </ul>
    </div>
  )
}

export default Index
