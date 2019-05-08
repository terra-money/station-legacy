import React from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import URLSearchParams from '@ungap/url-search-params'
import c from 'classnames'
import { OOPS } from '../../helpers/constants'
import { useAuth } from '../../hooks'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import Pagination from '../../components/Pagination'
import WithAuth from '../../components/WithAuth'
import WithRequest from '../../components/WithRequest'
import ErrorBoundary from '../../components/ErrorBoundary'
import Info from '../../components/Info'
import Tx from './Tx'
import s from './Txs.module.scss'

/* constants */
const tabs = ['send', 'receive', 'staking', 'swap', 'vote']
const Txs = ({ location: { search, pathname } }: RouteComponentProps) => {
  /* context */
  const { address } = useAuth()

  /* URLSearchParams: tab */
  const getSearch = () => new URLSearchParams(search)
  const getNextSearch = (entries: string[][]) => {
    const sp = getSearch()
    entries.forEach(([key, value]) =>
      value ? sp.set(key, value) : sp.delete(key)
    )

    return `?${sp.toString()}`
  }

  const currentTab = getSearch().get('tag') || ''
  const page = getSearch().get('page') || '1'

  /* render: tabs */
  const renderTabs = () => (
    <section className={s.tabs}>
      {renderTab('')}
      {tabs.map(renderTab)}
    </section>
  )

  const renderTab = (t: string) => {
    const isCurrent = t === currentTab
    const to = { pathname, search: getNextSearch([['tag', t], ['page', '']]) }
    const className = c('badge', isCurrent && 'badge-primary', s.tab)
    const attrs = { className: className, children: t || 'all', key: t }
    return isCurrent ? <span {...attrs} /> : <Link to={to} {...attrs} />
  }

  /* helpers */
  const getLink = (page: string) => ({
    pathname,
    search: getNextSearch([['page', page]])
  })

  return (
    <Page title="Transactions">
      <WithAuth card>
        <Card title={renderTabs()} headerClassName={s.header} bordered>
          <WithRequest
            url="/v1/msgs"
            params={{ account: address, action: currentTab, page }}
            loading={<Loading />}
            key={currentTab}
          >
            {({ txs, ...pagination }: Pagination & { txs: Tx[] }) => (
              <Pagination
                {...pagination}
                empty={
                  <Info icon="info" title="No transaction history">
                    Looks like you haven't made any transaction yet.
                  </Info>
                }
                link={getLink}
              >
                {txs.map((tx, index) => (
                  <ErrorBoundary fallback={<Card>{OOPS}</Card>} key={index}>
                    <Tx {...tx} />
                  </ErrorBoundary>
                ))}
              </Pagination>
            )}
          </WithRequest>
        </Card>
      </WithAuth>
    </Page>
  )
}

export default Txs
