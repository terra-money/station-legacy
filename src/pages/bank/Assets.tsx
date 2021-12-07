import { useAssets, AssetsUI } from '../../lib'
import { localSettings } from '../../utils/localStorage'
import { useApp, useRemovePadding } from '../../hooks'
import { useTokens } from '../../data/tokens'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Icon from '../../components/Icon'
import AddCW20Token from '../tokens/AddCW20Token'
import ManageCW20Tokens from '../tokens/ManageCW20Tokens'
import AvailableList from './AvailableList'
import VestingList from './VestingList'

const Assets = () => {
  useRemovePadding()

  const { hideSmallBalances: hideSmall = false } = localSettings.get()
  const { error, loading, ui } = useAssets({ hideSmall })
  const tokens = useTokens()

  const { modal } = useApp()
  const manageTokens = !!Object.keys(tokens).length && (
    <button onClick={() => modal.open(<ManageCW20Tokens />)}>
      <Icon name="settings" />
    </button>
  )

  const addToken = (
    <button className="btn-more" onClick={() => modal.open(<AddCW20Token />)}>
      Add token
    </button>
  )

  const render = ({ available, ibc, tokens, vesting }: AssetsUI) => (
    <>
      {available && <AvailableList {...available} />}
      {ibc && <AvailableList {...ibc} />}
      <AvailableList {...tokens} button={manageTokens} footer={addToken} />
      {vesting && <VestingList {...vesting} />}
    </>
  )

  return error ? (
    <ErrorComponent error={error} />
  ) : loading ? (
    <Loading card />
  ) : ui ? (
    render(ui)
  ) : null
}

export default Assets
