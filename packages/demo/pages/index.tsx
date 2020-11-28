import React, { FunctionComponent, useEffect, useState } from 'react'
import { AzaMetaWithName } from 'aza-meta'

const Index: FunctionComponent = () => {
  const [result, setResult] = useState<AzaMetaWithName[]>([])
  const [term, setTerm] = useState('白金台')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/search?term=${term}`)
      .then(res => res.json())
      .then(({ result }: { result: AzaMetaWithName[] }) => {
        setResult(result)
        setLoading(false)
      })
  }, [term])

  return(
    <div>
      <h1>aza demo</h1>
      <input type="text" value={term} onChange={e => setTerm(e.currentTarget.value)} />
      <p>Total: { loading ? "Loading..." : result.length}</p>
      <ul>
        { result.map(res => {
          return <li key={res.id}>{res.name}（{res.postalCodes.length === 1 ? '〒' + res.postalCodes[0] : '郵便番号がひとつじゃないよ' } {res.prefecture} {res.municipality}）</li>
        })}
      </ul>
    </div>
  )
}

export default Index
