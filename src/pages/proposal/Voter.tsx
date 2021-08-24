import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { VoterUI } from '../../lib'
import ExtLink from '../../components/ExtLink'

interface Props {
  voter: VoterUI
}

const Voter = ({ voter }: Props) => {
  const { pathname: from } = useLocation()
  const { address } = voter

  return 'moniker' in voter ? (
    <Link to={{ pathname: `/validator/${address}`, state: { from } }}>
      {voter.moniker}
    </Link>
  ) : (
    <ExtLink href={voter.link}>{address}</ExtLink>
  )
}

export default Voter
