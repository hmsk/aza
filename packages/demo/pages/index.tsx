import React, { FunctionComponent, useEffect, useState } from 'react'

const Index: FunctionComponent = () => {
  const [result, setResult] = useState<{ name: string }>(null)
  const [term, setTerm] = useState('')

  useEffect(() => {
    fetch(`/api/search?term=${term}`)
      .then(res => res.json())
      .then(result => {
        setResult(result)
      })
  }, [term])

  return(
    <div>
      <h1>aza demo</h1>
      <input type="text" onChange={e => setTerm(e.target.value)} />
      <p>{result?.name}</p>
    </div>
  )
}

export default Index
