import React, { FunctionComponent, useEffect, useState } from 'react'
import type { AzaMetaWithName } from 'aza-meta'

import FormattedPostalCode from '../components/FormattedPostalCode'

const InputAza: FunctionComponent<{
  aza: AzaMetaWithName
  onSelectAza: (aza: AzaMetaWithName) => void
}> = ({ onSelectAza }) => {
  const [result, setResult] = useState<AzaMetaWithName[]>([])
  const [term, setTerm] = useState('白金台')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    onSelectAza(null)
    fetch(`/api/search?term=${term}`)
      .then(res => res.json())
      .then(({ result }: { result: AzaMetaWithName[] }) => {
        setResult(result)
        setLoading(false)
      })
  }, [term])

  return (
    <>
      <input
        id="address-aza"
        className="flex-1 border border-current border-indigo-300 rounded h-10 mt-2 pl-2"
        type="text"
        value={term}
        onChange={e => setTerm(e.currentTarget.value)}
        placeholder="町丁目（例: 白金台五丁目）" />
      { result.length >= 0 && !loading ?
        <div className="mt-1 border shadow-md rounded absolute bg-white mt-14">
          { result.map(res => {
            return (
              <div
                className="py-2 pl-2 pr-4 cursor-pointer hover:bg-indigo-100"
                onClick={() => onSelectAza(res)} key={res.id}>
                <div>
                  {
                    res.postalCodes.length === 1 ?
                    <FormattedPostalCode postalCode={res.postalCodes[0]} /> :
                    <FormattedPostalCode postalCode='???-?????' />
                  }
                </div>
                <div>
                  { res.prefecture }{ res.municipality }
                  <strong>{ res.name }</strong>
                </div>
              </div>
            )
          })}
        </div> : ""
      }
    </>
  )
}

export default InputAza
