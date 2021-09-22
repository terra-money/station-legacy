import { TxsUI } from '../../lib'
import { useMenu, useTxs } from '../../lib'
import WithAuth from '../../auth/WithAuth'
import Page from '../../components/Page'
import Info from '../../components/Info'
import Loading from '../../components/Loading'
import More from '../../components/More'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorComponent from '../../components/ErrorComponent'
import Tx from './Tx'

interface Props {
  user: User
}

const List = ({ user }: Props) => {
  const { loading, error, ui } = useTxs(user)

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

  return error ? (
    <ErrorComponent error={error} />
  ) : ui ? (
    render(ui)
  ) : (
    <Loading />
  )
}

const Txs = () => {
  const { History: title } = useMenu()

  return (
    <Page title={title}>
      <WithAuth card>{(user) => <List user={user} />}</WithAuth>
    </Page>
  )
}

export default Txs
