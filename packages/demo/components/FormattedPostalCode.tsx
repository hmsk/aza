import React, { FunctionComponent } from 'react'

const FormattedPostalCode: FunctionComponent<{ postalCode: string }> = ({ postalCode }) => {
  const hyphenize = (postalCode: string) => `〒${postalCode.slice(0,3)}-${postalCode.slice(3,7)}`
  return <>{hyphenize(postalCode)}</>
}

export default FormattedPostalCode
