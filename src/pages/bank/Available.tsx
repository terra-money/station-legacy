import { AvailableItem } from '../../lib'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import AnchorEarn from '../../post/AnchorEarn'
import Send from '../../post/Send'
import AmountCard from './AmountCard'
import AnchorEarnCard from './AnchorEarnCard'
import { AnchorEarnTxType } from './useAnchorEarn'

interface Props extends AvailableItem {
  buttonLabel: string
}

const Available = (item: Props) => {
  const { denom, token, buttonLabel } = item
  const { modal } = useApp()

  const buttonAttrs = {
    onClick: () => modal.open(<Send denom={denom || token || ''} />),
    children: buttonLabel,
  }

  const renderAnchorEarnButton = (type: AnchorEarnTxType) => (
    <ButtonWithAuth
      onClick={() => modal.open(<AnchorEarn type={type} />)}
      className="btn btn-sky btn-sm"
      style={{ marginTop: type === 'Deposit' ? 10 : undefined }}
    >
      {type}
    </ButtonWithAuth>
  )

  const renderButtons = () => {
    return (
      <>
        <ButtonWithAuth {...buttonAttrs} className="btn btn-primary btn-sm" />
        <section>
          {denom === 'uusd' && renderAnchorEarnButton('Deposit')}
        </section>
      </>
    )
  }

  return (
    <AmountCard
      {...item}
      button={renderButtons()}
      buttonAttrs={buttonAttrs}
      extended={denom === 'uusd'}
    >
      {denom === 'uusd' && (
        <AnchorEarnCard button={renderAnchorEarnButton('Withdraw')} />
      )}
    </AmountCard>
  )
}

export default Available
