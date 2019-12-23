import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTabs, useModal } from '../../hooks'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Modal from '../../components/Modal'
import ButtonWithName from '../../components/ButtonWithName'
import WithMaxLuna from '../../components/WithMaxLuna'
import WithRequest from '../../components/WithRequest'
import NotAvailable from '../market/NotAvailable'
import NewProposal from './NewProposal'
import ProposalCard from './ProposalCard'
import Footer from './Footer'
import s from './Governance.module.scss'

const STATUS = ['', 'Deposit', 'Voting', 'Passed', 'Rejected']

const Governance = () => {
  const { t } = useTranslation()
  const modal = useModal()
  const { currentTab, renderTabs } = useTabs('status', STATUS)
  const params = useMemo(() => ({ status: currentTab }), [currentTab])

  const button = (
    <WithMaxLuna>
      {(max, balance) => (
        <ButtonWithName
          placement="bottom"
          className="btn btn-primary btn-sm"
          disabled={!balance.length}
          onClick={() =>
            modal.open(
              <WithRequest url="/distribution/community_pool">
                {({ result }: { result: Coin[] }) => (
                  <NewProposal
                    max={max}
                    communityPool={result}
                    onSubmitting={modal.prevent}
                    onSubmit={modal.close}
                  />
                )}
              </WithRequest>
            )
          }
        >
          {t('New proposal')}
        </ButtonWithName>
      )}
    </WithMaxLuna>
  )

  const renderProposal = (item: ProposalItem, index: number) => (
    <li className={s.item} key={index}>
      <ProposalCard {...item} />
    </li>
  )

  return (
    <Page title={t('Governance')} action={button}>
      <WithRequest url="/v1/gov/proposals" params={params}>
        {({ proposals, ...rest }: Governance) => (
          <Card
            title={renderTabs()}
            footer={<Footer {...rest} />}
            footerClassName={s.footer}
            bordered
          >
            {!proposals.length ? (
              <NotAvailable>
                {t('No proposals here yet. Be the first!')}
              </NotAvailable>
            ) : (
              <ul className={s.list}>{proposals.map(renderProposal)}</ul>
            )}
          </Card>
        )}
      </WithRequest>

      <Modal config={modal.config}>{modal.content}</Modal>
    </Page>
  )
}

export default Governance
