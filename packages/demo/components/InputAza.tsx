import React, { FunctionComponent, useEffect, useState } from 'react'
import type { AzaMetaWithName } from 'aza-meta'

import FormattedPostalCode from '../components/FormattedPostalCode'

const InputAza: FunctionComponent<{
  aza: AzaMetaWithName | null
  onSelectAza: (aza: AzaMetaWithName | null) => void
}> = ({ onSelectAza }) => {
  const [candidates, setCandidates] = useState<AzaMetaWithName[]>([])
  const [term, setTerm] = useState('白金台')
  const [isVisibleCandidates, setVisibilityOfCandidates] = useState(false)
  const [cursor, setCursor] = useState(0)

  const fetchCandidates = async (searchTerm: string) => {
    fetch(`/api/search?term=${searchTerm}`)
      .then(res => res.json())
      .then(({ result }: { result: AzaMetaWithName[] }) => {
        const candidatesToShow: AzaMetaWithName[] = []
        result.forEach((candidate) => {
          if (candidate.name === term || candidatesToShow.length <= 5) {
            candidatesToShow.push(candidate)
          }
        })
        setCandidates(candidatesToShow)
        setCursor(0)
      })
  }

  useEffect(() => {
    fetchCandidates(term)
  }, [term])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "ArrowDown") {
      const nextCursor = cursor == candidates.length - 1 ? 0 : cursor + 1
      setCursor(nextCursor)
      event.preventDefault()
    }
    if (event.key === "ArrowUp") {
      const nextCursor = cursor == 0 ? candidates.length - 1 : cursor - 1
      setCursor(nextCursor)
      event.preventDefault()
    }
    if (event.key === "Enter" && isVisibleCandidates && candidates[cursor]) {
      selectFromCandidate(candidates[cursor])
      setVisibilityOfCandidates(false)
    }
  }

  const selectFromCandidate = (selected: AzaMetaWithName): void => {
    setVisibilityOfCandidates(false)
    setTerm(selected.name)
    onSelectAza(selected)
  }

  const updateSearchTerm = (newTerm: string): void => {
    if (term !== newTerm) {
      setVisibilityOfCandidates(true)
      setTerm(newTerm)
      onSelectAza(null)
    }
  }

  return (
    <>
      <input
        id="address-aza"
        className="flex-1 border border-current border-indigo-300 rounded h-10 mt-2 pl-2"
        type="text"
        value={term}
        onChange={e => updateSearchTerm(e.currentTarget.value)}
        onFocus={() => setVisibilityOfCandidates(true)}
        onKeyDown={handleKeyPress}
        placeholder="町丁目（例: 白金台五丁目）" />
      { isVisibleCandidates && candidates.length >= 0 ?
        <div className="mt-1 border shadow-md rounded absolute bg-white mt-14">
          { candidates.map((res, i) => {
            return (
              <div
                className={`py-2 pl-2 pr-4 cursor-pointer${cursor == i ? ' bg-indigo-100' : '' }`}
                onClick={() => selectFromCandidate(res)}
                key={`${res.id}-${i}`}>
                <div>
                  {
                    res.postalCodes.length === 1 ?
                    <FormattedPostalCode postalCode={res.postalCodes[0]} /> :
                    <FormattedPostalCode postalCode='???????' />
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
