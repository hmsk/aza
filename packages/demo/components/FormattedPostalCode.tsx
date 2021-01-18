const FormattedPostalCode: React.FC<{ postalCode: string }> = ({ postalCode }) => {
  const hyphenize = (postalCode: string) => `〒${postalCode.slice(0,3)}-${postalCode.slice(3,7)}`
  return <>{hyphenize(postalCode)}</>
}

export default FormattedPostalCode
