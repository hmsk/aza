import React, { FunctionComponent, useEffect, useState } from 'react'
import { AzaMetaWithName } from 'aza-meta'

const Index: FunctionComponent = () => {
  const [result, setResult] = useState<AzaMetaWithName[]>([])
  const [selected, setSelectedAza] = useState<AzaMetaWithName>(null)
  const [term, setTerm] = useState('白金台')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setSelectedAza(null)
    fetch(`/api/search?term=${term}`)
      .then(res => res.json())
      .then(({ result }: { result: AzaMetaWithName[] }) => {
        setResult(result)
        setLoading(false)
      })
  }, [term])

  const selectAza = (aza: AzaMetaWithName) => {
    setTerm(aza.name)
    setSelectedAza(aza)
  }

  const hyphenize = (postalCode: string) => `〒${postalCode.slice(0,3)}-${postalCode.slice(3,7)}`

  return(
    <div className="min-h-screen">
      <div className="flex flex-row w-full">
        <div className="flex-1 pt-24 bg-indigo-50">
          <div className="border shadow-md bg-white rounded w-3/4 m-auto p-4">
            <h2>商品の配送先</h2>
            <div>
              <div className="mt-4">
                { selected ?
                  [hyphenize(selected.postalCodes[0]), selected.prefecture, selected.municipality].join(' ') : "市区町村以前の入力は必要ありません"
                }
              </div>
              <div className="flex w-full">
                <input
                  id="address-aza"
                  className="flex-1 border border-current border-indigo-300 rounded h-10 mt-2 pl-2"
                  type="text"
                  value={term}
                  onChange={e => setTerm(e.currentTarget.value)}
                  placeholder="町丁目（例: 白金台五丁目）" />
                { !selected && result.length >= 0 && !loading ?
                  <div className="mt-1 border shadow-md rounded absolute bg-white mt-14">
                    { result.map(res => {
                      return (
                        <div
                          className="py-2 pl-2 pr-4 cursor-pointer hover:bg-indigo-100"
                          onClick={() => selectAza(res)} key={res.id}>
                          <div>
                            { res.postalCodes.length === 1 ? hyphenize(res.postalCodes[0]) : hyphenize('???-?????') }
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
                <input
                  type="text"
                  className="border border-current border-indigo-300 rounded h-10 mt-2 pl-2 ml-2"
                  placeholder="番地（例: 12-5）"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="border border-current border-indigo-300 rounded h-10 mt-2 pl-2"
                  placeholder="建物名、部屋番号など"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 border-l-2 border-indigo-100 min-h-screen">
          <div className="pt-24 px-12">
            <h1>Aza</h1>
            <p>
              Aza は日本の住所情報の入力における、UXについて考えるプロジェクトです。
              まずは、特に「町丁目（小字）からの入力」により、ユーザの入力時の負担軽減の可能性を検討しています。
            </p>
            <ul className="list-disc mt-4 ml-4">
              <li>郵便番号からの入力による負担</li>
              <li>アメリカの住所入力</li>
              <li>番地により郵便番号が異なる</li>
              <li>オートコンプリート</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
