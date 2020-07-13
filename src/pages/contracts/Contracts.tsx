import React, { useState, ReactNode } from 'react'
import { ContractsUI, is } from '@terra-money/use-station'
import { useMenu, useContracts } from '@terra-money/use-station'
import { useApp } from '../../hooks'
import Page from '../../components/Page'
import Info from '../../components/Info'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import Pagination from '../../components/Pagination'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorComponent from '../../components/ErrorComponent'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import ActionBar from '../../components/ActionBar'
import Create from '../../post/Create'
import Upload from '../../post/Upload'
import Contract from './Contract'
import Search from './Search'

const Contracts = () => {
  const [page, setPage] = useState(1)
  const [params, setParams] = useState<{ owner?: string; search?: string }>({})
  const { error, ui, create, upload } = useContracts({ page, ...params })
  const { Contracts: title } = useMenu()
  const { modal } = useApp()

  const submit = (value: string) => {
    setParams(!value ? {} : { [is.address(value) ? 'owner' : 'search']: value })
  }

  /* render */
  type Params = { attrs: { children: string }; component: ReactNode }
  const renderButton = ({ attrs, component }: Params) => (
    <ButtonWithAuth
      {...attrs}
      placement="bottom"
      className="btn btn-primary btn-sm"
      onClick={() => modal.open(component)}
    />
  )

  const buttons = (
    <ActionBar
      list={[
        renderButton({ ...create, component: <Create /> }),
        renderButton({ ...upload, component: <Upload /> }),
      ]}
    />
  )

  const render = ({ pagination, card, list, search: attrs }: ContractsUI) => {
    const empty = card && <Info {...card} icon="info_outline" />

    return (
      <>
        <Search submit={submit} placeholder={attrs?.placeholder} />
        <Pagination {...pagination} empty={empty} action={setPage}>
          {list?.map((contract, index) => (
            <ErrorBoundary fallback={<ErrorComponent />} key={index}>
              <Contract {...contract} />
            </ErrorBoundary>
          ))}
        </Pagination>
      </>
    )
  }

  return (
    <Page title={title} action={buttons}>
      <Card>{error ? <ErrorComponent /> : ui ? render(ui) : <Loading />}</Card>
    </Page>
  )
}

export default Contracts
