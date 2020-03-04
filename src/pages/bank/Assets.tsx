import React from 'react'
import { useAssets, AssetsUI, User } from '@terra-money/use-station'
import { localSettings } from '../../utils/localStorage'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Info from '../../components/Info'
import Address from './Address'
import AvailableList from './AvailableList'
import VestingList from './VestingList'

const Assets = ({ user }: { user: User }) => {
  const { hideSmallBalances: hideSmall = false } = localSettings.get()
  const { error, loading, address, ui } = useAssets(user, { hideSmall })

  const render = ({ card, available, vesting }: AssetsUI) => (
    <>
      {card && <Info icon="info_outline" {...card} card />}
      {available && <AvailableList {...available} />}
      {vesting && <VestingList {...vesting} />}
    </>
  )

  return (
    <>
      {address && <Address {...address} />}

      {error ? (
        <ErrorComponent />
      ) : loading ? (
        <Loading card />
      ) : (
        ui && render(ui)
      )}
    </>
  )
}

export default Assets
