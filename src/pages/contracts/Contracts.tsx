import { useState, ReactNode } from 'react'
import { ContractsUI } from '../../lib'
import { useMenu, useContract, useContracts } from '../../lib'
import { useApp, useGoBack } from '../../hooks'
import useRenderContract from '../hooks/contracts/useRenderContract'
import Page from '../../components/Page'
import Info from '../../components/Info'
import Card from '../../components/Card'
import Loading from '../../components/Loading'
import More from '../../components/More'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorComponent from '../../components/ErrorComponent'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import ActionBar from '../../components/ActionBar'
import Create from '../../post/Create'
import Upload from '../../post/Upload'
import Contract from './Contract'
import Search from './Search'

const Contracts = () => {
  useGoBack('/')
  const [param, setParam] = useState<string>('') // For searching with contract address
  const { error, ui, create, upload } = useContracts()
  const { data: contract } = useContract(param)
  const renderContract = useRenderContract()
  const { Contracts: title } = useMenu()
  const { modal } = useApp()

  const submit = (value: string) => {
    setParam(value)
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

  const render = ({ card, list, search: attrs, more }: ContractsUI) => {
    return (
      <>
        <Search submit={submit} placeholder={attrs?.placeholder} />

        {contract ? (
          <Contract {...renderContract(contract)} />
        ) : (
          <More
            isEmpty={!list?.length}
            empty={card ? <Info {...card} icon="info_outline" /> : undefined}
            more={more}
          >
            {list?.map((contract, index) => (
              <ErrorBoundary fallback={<ErrorComponent />} key={index}>
                <Contract {...contract} />
              </ErrorBoundary>
            ))}
          </More>
        )}
      </>
    )
  }

  return (
    <Page
      title={title}
      desc='Use "Upload" to upload a .wasm file, use "Create" to initialize the contract'
      action={buttons}
    >
      <Card>
        {error ? (
          <ErrorComponent error={error} />
        ) : ui ? (
          render(ui)
        ) : (
          <Loading />
        )}
      </Card>
    </Page>
  )
}

export default Contracts
