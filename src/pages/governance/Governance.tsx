import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { reverse } from 'ramda'
import { Proposal } from '@terra-money/terra.js'
import { useMenu } from '../../lib'
import useLCD from '../../api/useLCD'
import { usePageTabs, useApp } from '../../hooks'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Page from '../../components/Page'
import Card from '../../components/Card'
import NotAvailable from '../../components/NotAvailable'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import Propose from '../../post/Propose'
import { ProposalStatusItem } from '../../data/lcd/gov'
import { useProposalStatusList } from '../../data/lcd/gov'
import GovernanceParams from './GovernanceParams'
import ProposalItem from './ProposalItem'
import s from './Governance.module.scss'

const DEFAULT_TAB = 'voting_period'

const Governance = () => {
  const { t } = useTranslation()
  const { modal } = useApp()
  const proposalStatus = useProposalStatusList()
  const tabs = sortByIsVoting(Object.values(proposalStatus))
  const { Governance: title } = useMenu()
  const { currentTab, renderTabs } = usePageTabs('status', tabs, DEFAULT_TAB)
  const status = currentTab || DEFAULT_TAB

  const lcd = useLCD()
  const result = useQuery(['proposals', status], async () => {
    const proposals = await lcd.gov.proposals({ status })
    return reverse(proposals)
  })

  const { error, isLoading, data: proposals } = result

  const button = (
    <ButtonWithAuth
      placement="bottom"
      className="btn btn-primary btn-sm"
      onClick={() => modal.open(<Propose />)}
    >
      {t('Page:Governance:New proposal')}
    </ButtonWithAuth>
  )

  return (
    <Page title={title} action={button}>
      <Card
        title={renderTabs()}
        footer={<GovernanceParams />}
        footerClassName={s.footer}
        bordered
      >
        {error ? (
          <ErrorComponent error={error as Error} />
        ) : isLoading ? (
          <Loading />
        ) : !proposals?.length ? (
          <NotAvailable>
            {t('Page:Governance:No proposals here yet. Be the first!')}
          </NotAvailable>
        ) : (
          <ul className={s.list}>
            {proposals?.map((item: Proposal, index: number) => (
              <li className={s.item} key={index}>
                <ProposalItem proposal={item} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Page>
  )
}

export default Governance

/* helpers */
const sortByIsVoting = (array: ProposalStatusItem[]) =>
  array.sort(
    ({ key: a }, { key: b }) =>
      Number(b === 'voting_period') - Number(a === 'voting_period')
  )
