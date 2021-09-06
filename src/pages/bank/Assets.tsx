import { useAssets, AssetsUI } from '../../lib'
import { isExtension } from '../../utils/env'
import { localSettings } from '../../utils/localStorage'
import { useApp, useRemovePadding } from '../../hooks'
import { useTokens } from '../../data/tokens'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Info from '../../components/Info'
import Icon from '../../components/Icon'
import AddToken from '../tokens/AddToken'
import ManageTokens from '../tokens/ManageTokens'
import AvailableList from './AvailableList'
import VestingList from './VestingList'

const Assets = () => {
  useRemovePadding()

  const { hideSmallBalances: hideSmall = false } = localSettings.get()
  const { error, loading, ui } = useAssets({ hideSmall })
  const tokens = useTokens()

  const { modal } = useApp()
  const manageTokens = !!Object.keys(tokens).length && (
    <button onClick={() => modal.open(<ManageTokens />)}>
      <Icon name="settings" />
    </button>
  )

  const addToken = (
    <button className="btn-more" onClick={() => modal.open(<AddToken />)}>
      Add token
    </button>
  )

  const render = ({ card, available, tokens, vesting }: AssetsUI) => (
    <>
      {card && <Info icon="info_outline" {...card} card={!isExtension} />}
      {available && <AvailableList {...available} />}
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
