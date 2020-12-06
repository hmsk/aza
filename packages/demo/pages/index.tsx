import React, { FunctionComponent, useEffect, useState } from 'react'
import { AzaMetaWithName } from 'aza-meta'

const Index: FunctionComponent = () => {
  const [result, setResult] = useState<AzaMetaWithName[]>([])
  const [selected, selectAza] = useState<AzaMetaWithName>(null)
  const [term, setTerm] = useState('白金台')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    selectAza(null)
    fetch(`/api/search?term=${term}`)
      .then(res => res.json())
      .then(({ result }: { result: AzaMetaWithName[] }) => {
        setResult(result)
        setLoading(false)
      })
  }, [term])

  return(
    <div className="min-h-screen">
      <div className="flex flex-row w-full">
        <div className="flex-1 pt-24 bg-indigo-50">
          <h1>Shipping Address:</h1>
          <div>
            { selected ?
              <div className="mt-4">
                { [selected.postalCodes[0], selected.prefecture, selected.municipality, selected.name].join(' ') }
              </div> : ""
            }
            <input
              className="border border-current border-indigo-300 rounded h-10"
              type="text"
              value={term}
              onChange={e => setTerm(e.currentTarget.value)}
              placeholder="白金台五丁目" />
            { !selected ?
              <ul className="mt-4">
                { result.map(res => {
                  return <li key={res.id} onClick={() => selectAza(res)}>{res.name}（{res.postalCodes.length === 1 ? '〒' + res.postalCodes[0] : '郵便番号がひとつじゃないよ' } {res.prefecture} {res.municipality}）</li>
                })}
              </ul> : ""
            }
          </div>
        </div>
        <div className="flex-1 border-l-2 border-indigo-100 pt-24 min-h-screen">
          <h1>Aza demo</h1>
          <p>Total: { loading ? "Loading..." : result.length}</p>
          <p>Selected: { selected ? selected.id : "Noe selected yet" }</p>
        </div>
      </div>
    </div>
  )
}

export default Index
