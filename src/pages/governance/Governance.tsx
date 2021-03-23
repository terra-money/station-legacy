import React from 'react'
import { ProposalItemUI } from '../../use-station/src'
import { useMenu } from '../../use-station/src'
import { useGovernance, useProposalStatus } from '../../use-station/src'
import { usePageTabs, useApp } from '../../hooks'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Page from '../../components/Page'
import Card from '../../components/Card'
import NotAvailable from '../../components/NotAvailable'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import Propose from '../../post/Propose'
import GovernanceParams from './GovernanceParams'
import ProposalItem from './ProposalItem'
import s from './Governance.module.scss'

const Governance = () => {
  const { modal } = useApp()
  const tabs = useProposalStatus()
  const { Governance: title } = useMenu()
  const { currentTab, renderTabs } = usePageTabs('status', tabs)
  const { error, loading, ui, propose } = useGovernance({ status: currentTab })

  const button = (
    <ButtonWithAuth
      {...propose.attrs}
      placement="bottom"
      className="btn btn-primary btn-sm"
      onClick={() => modal.open(<Propose />)}
    />
  )

  const renderItem = (item: ProposalItemUI, index: number) => (
    <li className={s.item} key={index}>
      <ProposalItem {...item} />
    </li>
  )

  return (
    <Page title={title} action={button}>
      <Card
        title={renderTabs()}
        footer={ui && <GovernanceParams list={ui.params} />}
        footerClassName={s.footer}
        bordered
      >
        {error ? (
          <ErrorComponent error={error} />
        ) : loading ? (
          <Loading />
        ) : ui?.message ? (
          <NotAvailable>{ui.message}</NotAvailable>
        ) : (
          <ul className={s.list}>{ui?.list?.map(renderItem)}</ul>
        )}
      </Card>
    </Page>
  )
}

export default Governance
