import React, { FunctionComponent, useRef, useState } from 'react'
import type { AzaMetaWithName } from 'aza-meta'
import { react as ArticleIndex } from '../articles/index.md'

import InputAza from '../components/InputAza'
import FormattedPostalCode from '../components/FormattedPostalCode'

const Index: FunctionComponent = () => {
  const [selected, setSelectedAza] = useState<AzaMetaWithName | null>(null)
  const banchi = useRef<HTMLInputElement>(null)

  const updateAddress = (aza: AzaMetaWithName | null) => {
    setSelectedAza(aza)
    if (aza !== null) {
      banchi.current?.focus()
    }
  }


  return(
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row w-full">
        <div className="flex-1 py-24 bg-indigo-50">
          <div className="border shadow-md bg-white rounded mx-4 lg:w-3/4 lg:m-auto p-4">
            <h2>商品の配送先</h2>
            <div>
              <div className="mt-4">
                { selected ?
                  <>
                    <FormattedPostalCode postalCode={selected.postalCodes[0]} />
                    &nbsp;{selected.prefecture}{selected.municipality}
                  </> :
                  "市区町村以前の入力は必要ありません"
                }
              </div>
              <form className="w-full">
                <InputAza aza={selected} onSelectAza={updateAddress} />
                <input
                  type="text"
                  ref={banchi}
                  className="border border-current border-indigo-300 rounded h-10 mt-2 pl-2 w-full"
                  placeholder="番地（例: 12-5）"
                />
                <input
                  type="text"
                  className="border border-current border-indigo-300 rounded h-10 mt-2 pl-2 w-full"
                  placeholder="建物名、部屋番号など"
                />
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 border-l-2 border-indigo-100 min-h-screen">
          <div className="pt-12 px-4 lg:px-12 lg:overflow-y-auto lg:max-h-screen">
            <ArticleIndex />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
