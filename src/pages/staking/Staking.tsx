import React from 'react'
import { useTranslation } from 'react-i18next'
import { gte } from '../../api/math'
import { useAuth, useModal } from '../../hooks'
import Modal from '../../components/Modal'
import Page from '../../components/Page'
import Card from '../../components/Card'
import WithRequest from '../../components/WithRequest'
import Loading from '../../components/Loading'
import ButtonWithName from '../../components/ButtonWithName'
import ValidatorsList from './ValidatorsList'
import Withdraw from './Withdraw'
import Columns from './Columns'
import MyDelegations from './MyDelegations'

const Staking = () => {
  const { t } = useTranslation()
  const { address, name, withLedger } = useAuth()
  const modal = useModal()

  const render = (staking: Staking) => {
    const { myDelegations, rewards } = staking

    const button = address && (
      <ButtonWithName
        placement="bottom"
        className="btn btn-primary btn-sm"
        disabled={(!name && !withLedger) || !(rewards && gte(rewards.total, 1))}
        onClick={() =>
          rewards &&
          modal.open(
            <Withdraw
              amounts={rewards.denoms}
              onWithdrawing={modal.prevent}
              onWithdraw={modal.close}
            />
          )
        }
      >
        {t('Withdraw all rewards')}
      </ButtonWithName>
    )

    return (
      <Page title={t('Staking')} action={button}>
        {address && (
          <>
            <Columns {...staking} />

            {myDelegations && !!myDelegations.length && (
              <Card>
                <MyDelegations myDelegations={myDelegations} />
              </Card>
            )}

            <h2>{t('Validators')}</h2>
          </>
        )}

        <Card>
          <ValidatorsList {...staking} />
        </Card>
      </Page>
    )
  }

  const loading = (
    <Page title={t('Staking')}>
      <Card>
        <Loading />
      </Card>
    </Page>
  )

  const url = address ? `/v1/staking/${address}` : '/v1/staking'
  return (
    <>
      <Modal config={modal.config}>{modal.content}</Modal>
      <WithRequest url={url} loading={loading}>
        {render}
      </WithRequest>
    </>
  )
}

export default Staking
