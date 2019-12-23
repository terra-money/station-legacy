import React from 'react'
import { useTranslation } from 'react-i18next'
import { OOPS } from '../../helpers/constants'
import { useAuth, useTabs } from '../../hooks'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import Pagination from '../../components/Pagination'
import WithAuth from '../../components/WithAuth'
import WithRequest from '../../components/WithRequest'
import ErrorBoundary from '../../components/ErrorBoundary'
import Info from '../../components/Info'
import Tx from './Tx'

const TABS = ['', 'send', 'receive', 'staking', 'market', 'governance']

const Txs = () => {
  const { t } = useTranslation()
  const { address } = useAuth()
  const { currentTab, page, renderTabs, getLink } = useTabs('tag', TABS)

  return (
    <Card title={renderTabs()} bordered>
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
              <Info icon="info_outline" title={t('No transaction history')}>
                {t("Looks like you haven't made any transaction yet.")}
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
  )
}

const TxsContainer = () => {
  const { t } = useTranslation()
  return (
    <Page title={t('Transactions')}>
      <WithAuth card>
        <Txs />
      </WithAuth>
    </Page>
  )
}

export default TxsContainer
