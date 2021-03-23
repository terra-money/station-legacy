import React from 'react'
import { TxType, TxsUI, User } from '../../use-station/src'
import { useMenu, useTxs, useTxTypes } from '../../use-station/src'
import usePageTabs from '../../hooks/useTabs'
import WithAuth from '../../auth/WithAuth'
import Page from '../../components/Page'
import Info from '../../components/Info'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import More from '../../components/More'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorComponent from '../../components/ErrorComponent'
import Tx from './Tx'

const List = ({ user }: { user: User }) => {
  const tabs = useTxTypes()
  const { currentTab, renderTabs } = usePageTabs('tag', tabs)
  const params = { type: currentTab as TxType }
  const { error, ui } = useTxs(user, params)

  const render = ({ card, list, more }: TxsUI) => {
    const empty = card && <Info {...card} icon="info_outline" />

    return (
      <More isEmpty={!list?.length} empty={empty} more={more}>
        {list?.map((tx, index) => (
          <ErrorBoundary fallback={<ErrorComponent />} key={index}>
            <Tx {...tx} />
          </ErrorBoundary>
        ))}
      </More>
    )
  }

  return (
    <Card title={renderTabs()} bordered>
      {error ? <ErrorComponent error={error} /> : ui ? render(ui) : <Loading />}
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
