import React, { ReactNode } from 'react'
import { TxType, TxsUI, User } from '../../use-station/src'
import { useMenu, useTxs, useTxTypes } from '../../use-station/src'
import useTabs from '../../hooks/useTabs'
import WithAuth from '../../auth/WithAuth'
import Page from '../../components/Page'
import Info from '../../components/Info'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import More from '../../components/More'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorComponent from '../../components/ErrorComponent'
import Tx from './Tx'

interface Props {
  user: User
  currentTab: string
  renderTabs: () => ReactNode
}

const List = ({ user, currentTab, renderTabs }: Props) => {
  const params = { type: currentTab as TxType }
  const { loading, error, ui } = useTxs(user, params)

  const render = ({ card, list, more }: TxsUI) => {
    const empty = card && <Info {...card} icon="info_outline" />

    return (
      <More isEmpty={!loading && !list?.length} empty={empty} more={more}>
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
  const txTypes = useTxTypes()
  const tabs = useTabs('tag', txTypes)

  return (
    <Page title={title}>
      <WithAuth card>
        {(user) => <List user={user} {...tabs} key={tabs.currentTab} />}
      </WithAuth>
    </Page>
  )
}

export default Txs
