import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { format } from '../../utils'
import Finder from '../../components/Finder'

interface Props extends SimpleValidator {
  noTruncate?: boolean
}

const ValidatorLink = ({ noTruncate, ...props }: Props) => {
  const { operatorAddress, accountAddress, moniker } = props
  const { pathname: from } = useLocation()

  return moniker ? (
    <Link to={{ pathname: `/validator/${operatorAddress}`, state: { from } }}>
      {moniker}
    </Link>
  ) : (
    <Finder q="account" v={accountAddress}>
      {noTruncate ? accountAddress : format.truncate(accountAddress, [7, 6])}
    </Finder>
  )
}

export default ValidatorLink
