import { useEffect } from 'react'
import { RawKey } from '@terra-money/terra.js'
import { ConfirmProps, format } from '../lib'
import { useConfirm } from '../lib'
import LedgerKey from '../extension/LedgerKey'
import { decryptWallet, getStoredWallet } from '../utils/localStorage'
import { useUser } from '../data/auth'
import getSigner from '../wallet/signer'
import signTx from '../wallet/api/signTx'
import * as ledgers from '../wallet/ledger'
import ModalContent from '../components/ModalContent'
import Select from '../components/Select'
import Flex from '../components/Flex'
import { PW, isPreconfigured } from '../layouts/Preconfigured'
import ConfirmationComponent from './ConfirmationComponent'

interface Props {
  confirm: ConfirmProps
  modal: Modal
  onFinish?: () => void
}

const Confirmation = ({ confirm, modal, onFinish }: Props) => {
  const user = useUser()

  const confirmUI = useConfirm(confirm, {
    user: user!,
    password: isPreconfigured(user!) ? PW : '',
    getKey: async (params) => {
      if (user?.ledger) {
        const key = new LedgerKey(await ledgers.getPubKey())
        return key
      } else if (user?.wallet) {
        // Preconfigured wallet
        const { password } = params!
        const { privateKey } = decryptWallet(user.wallet, password)
        return new RawKey(Buffer.from(privateKey, 'hex'))
      } else {
        const { name, password } = params!
        const { privateKey } = getStoredWallet(name, password)
        const key = new RawKey(Buffer.from(privateKey, 'hex'))
        return key
      }
    },
    sign: async ({ tx, base, password }) => {
      const { ledger, name } = user!
      const type = ledger ? 'ledger' : 'local'
      const params = { name, password }
      const signer = await getSigner(type, params, user?.wallet)
      const signedTx = await signTx(tx, signer, base)
      return signedTx
    },
  })

  const { contents, fee, form } = confirmUI

  const finish = () => {
    onFinish?.()
    modal.close()
  }

  /* prevent to close modal */
  useEffect(() => {
    modal.prevent(!!form.submitting)
    // eslint-disable-next-line
  }, [form.submitting])

  /* render */
  const renderName = (label: string) => {
    const [head, tail] = label.split('(')
    return (
      <>
        {head}
        {tail && <small>({tail}</small>}
      </>
    )
  }

  const modalActions = {
    goBack: confirm.cancel,
    close: modal.close,
    disabled: form.submitting,
  }

  const contentsDl = contents.map(({ name, text, displays }) => ({
    dt: renderName(name),
    dd:
      text ??
      displays?.map(({ value, unit }, index) => (
        <div key={index}>
          <span>{value}</span> <span>{unit}</span>
        </div>
      )),
  }))

  const feeDl = (fee.status || fee.select.attrs.value) && {
    dt: (
      <Flex>
        <span className="form-control-sm">{fee.label}</span>
        {!fee.status && (
          <Select
            {...fee.select.attrs}
            className="form-control form-control-sm"
            onChange={(e) => fee.select.setValue(e.target.value)}
          >
            {fee.select.options.map((option) => (
              <option {...option} key={option.value} />
            ))}
          </Select>
        )}
      </Flex>
    ),

    dd: fee.status ? (
      <span className="form-control-sm">{fee.status}</span>
    ) : fee.select.attrs.value ? (
      <Flex>
        <div className="input-group">
          <input
            {...fee.input.attrs}
            className="form-control form-control-sm"
            onChange={(e) => fee.input.setValue(e.target.value)}
            readOnly
          />
          <div className="input-group-append">
            <span className="input-group-text">
              {format.denom(fee.select.attrs.value)}
            </span>
          </div>
        </div>

        {fee.message && (
          <p className="text-right pre-line">
            <small>{fee.message}</small>
          </p>
        )}
      </Flex>
    ) : null,
  }

  return (
    <ModalContent {...modalActions}>
      <ConfirmationComponent
        dl={feeDl ? [...contentsDl, feeDl] : [...contentsDl]}
        onFinish={finish}
        {...confirmUI}
      />
    </ModalContent>
  )
}

export default Confirmation
