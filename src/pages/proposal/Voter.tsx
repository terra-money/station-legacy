import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { VoterUI, format } from '@terra-money/use-station'
import ExtLink from '../../components/ExtLink'

interface Props {
  voter: VoterUI
  noTruncate?: boolean
}

const Voter = ({ voter, noTruncate }: Props) => {
  const { pathname: from } = useLocation()
  const { address } = voter

  return 'moniker' in voter ? (
    <Link to={{ pathname: `/validator/${address}`, state: { from } }}>
      {voter.moniker}
    </Link>
  ) : (
    <ExtLink href={voter.link}>
      {noTruncate ? address : format.truncate(address, [7, 6])}
    </ExtLink>
  )
}

export default Voter
