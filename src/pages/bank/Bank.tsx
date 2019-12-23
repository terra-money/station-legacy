import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks'
import WithRequest from '../../components/WithRequest'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Info from '../../components/Info'
import WithAuth from '../../components/WithAuth'
import Address from './Address'
import AvailableList from './AvailableList'
import VestingList from './VestingList'

const Bank = () => {
  const { t } = useTranslation()
  const { address } = useAuth()
  return (
    <Page title={t('Bank')}>
      <WithAuth card>
        <Card title={t('My wallet')} bordered>
          <Address address={address} />
        </Card>

        <WithRequest url={`/v1/bank/${address}`}>
          {({ balance, vesting }: Bank) => (
            <>
              {balance.length ? (
                <AvailableList list={balance} />
              ) : (
                <Card>
                  <Info icon="info_outline" title={t('Account empty')}>
                    {t("This account doesn't hold any coins yet.")}
                  </Info>
                </Card>
              )}

              {!!vesting.length && <VestingList list={vesting} />}
            </>
          )}
        </WithRequest>
      </WithAuth>
    </Page>
  )
}

export default Bank
