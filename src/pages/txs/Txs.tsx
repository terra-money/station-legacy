import React from 'react'
import { TxType, TxsUI, User } from '@terra-money/use-station'
import { useMenu, useTxs, useTxTypes } from '@terra-money/use-station'
import { useTabs } from '../../hooks'
import WithAuth from '../../auth/WithAuth'
import Page from '../../components/Page'
import Info from '../../components/Info'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import Pagination from '../../components/Pagination'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorComponent from '../../components/ErrorComponent'
import Tx from './Tx'

const List = ({ user }: { user: User }) => {
  const tabs = useTxTypes()
  const { currentTab, page, renderTabs, getLink } = useTabs('tag', tabs)
  const params = { type: currentTab as TxType, page }
  const { error, ui } = useTxs(user, params)

  const render = ({ pagination, card, list }: TxsUI) => {
    const empty = card && <Info {...card} icon="info_outline" />

    return (
      <Pagination {...pagination} empty={empty} link={getLink}>
        {list?.map((tx, index) => (
          <ErrorBoundary fallback={<ErrorComponent />} key={index}>
            <Tx {...tx} />
          </ErrorBoundary>
        ))}
      </Pagination>
    )
  }

  return (
    <Card title={renderTabs()} bordered>
      {error ? <ErrorComponent /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

const Txs = () => {
  const { History: title } = useMenu()

  return (
    <Page title={title}>
      <WithAuth card>{(user) => <List user={user} />}</WithAuth>
    </Page>
  )
}

export default Txs
