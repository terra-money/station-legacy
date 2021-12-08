import { useState, ReactNode, useEffect } from 'react'
import c from 'classnames'
import { addHours, isBefore } from 'date-fns'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import extension from 'extensionizer'
import { CreateTxOptions, PublicKey, SignatureV2 } from '@terra-money/terra.js'
import { Msg, TxInfo, Fee, Tx } from '@terra-money/terra.js'
import { isTxError } from '@terra-money/terra.js'
import { LCDClient, RawKey } from '@terra-money/terra.js'
import { Field, format, is } from '../lib'
import { decrypt } from '../utils'
import { testPassword, getStoredWallet } from '../utils/localStorage'
import useTerraAssets from '../hooks/useTerraAssets'
import { useCurrentChain } from '../data/chain'
import { useUser } from '../auth/auth'
import * as ledger from '../wallet/ledger'
import { useExtension } from './useExtension'
import { ExtSign, RecordedExtSign, TxOptionsData } from './useExtension'
import ConfirmationComponent from '../post/ConfirmationComponent'
import { PW, isPreconfigured } from '../layouts/Preconfigured'
import Pagination from './Pagination'
import Submitting from './Submitting'
import Message from './Message'
import IBCUnit from '../pages/bank/IBCUnit'
import LedgerKey from '../extension/LedgerKey'
import s from './Confirm.module.scss'

interface Props extends RecordedExtSign {
  user: User
  pagination: ReactNode
  onFinish: (params: Partial<ExtSign & { password: string }>) => void
}

const Component = ({ requestType, details, ...props }: Props) => {
  const { user, pagination, onFinish } = props
  const { name } = user
  const { id, origin, gasPrices, ...rest } = details
  const { waitForConfirmation, bytes, ...txOptionsData } = rest
  const txOptions = parseCreateTxOptions(txOptionsData)

  const msgs = txOptions?.msgs
  const memo = txOptions?.memo
  const fee = txOptions?.fee

  /* chain */
  const { chainID, lcd: URL, name: network } = useCurrentChain()
  const lcdClientConfig = Object.assign(
    { chainID, URL },
    gasPrices && { gasPrices }
  )

  const lcd = new LCDClient(lcdClientConfig)

  /* sign tx */
  const signTx = async () => {
    setSubmitting(true)

    try {
      let result

      if (user.ledger) {
        if (!txOptions) return

        const pk = await ledger.getPubKey()
        if (!pk) throw new Error('PubKey is undefined')

        const publicKey = PublicKey.fromAmino({
          type: 'tendermint/PubKeySecp256k1',
          value: pk.toString('base64'),
        })

        const key = new LedgerKey(publicKey)
        const wallet = lcd.wallet(key)

        const { account_number, sequence } =
          await wallet.accountNumberAndSequence()

        const stdSignMsg = await wallet.createTx({ ...txOptions, sequence })
        const signedTx = await key.signTx(stdSignMsg, {
          accountNumber: account_number,
          sequence,
          signMode: SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
          chainID,
        })

        result = signedTx.toData()
      } else {
        const { privateKey } = getStoredWallet(name!, password)
        const key = new RawKey(Buffer.from(privateKey, 'hex'))

        if (bytes) {
          const { signature, recid } = await key.ecdsaSign(
            Buffer.from(bytes, 'base64')
          )

          if (!signature) throw new Error('signature is undefined')

          result = {
            recid,
            signature: Buffer.from(signature).toString('base64'),
            public_key: key.publicKey?.toAmino().value as string,
          }
        } else if (txOptions) {
          const wallet = lcd.wallet(key)
          const stdSignMsg = await wallet.createTx(txOptions)
          const { account_number, sequence } =
            await wallet.accountNumberAndSequence()

          const signedTx = await key.signTx(stdSignMsg, {
            accountNumber: account_number,
            sequence,
            signMode: SignatureV2.SignMode.SIGN_MODE_DIRECT,
            chainID,
          })

          result = signedTx.toData()
        }
      }

      onFinish({
        result,
        success: true,
        password: storePassword ? password : undefined,
      })
      setSubmitting(false)
      setSubmitted(true)
    } catch (error) {
      setSubmitting(false)
      setSubmitted(true)
      setErrorMessage(error.message)
      onFinish({
        success: false,
        password: storePassword ? password : undefined,
        error: {
          code: 3,
          message:
            error.response?.data?.error /* error on tx */ ?? error.message,
        },
      })
    }
  }

  /* post tx */
  const postTx = async () => {
    if (!txOptions) return

    setSubmitting(true)

    try {
      let signed: Tx

      if (user.ledger) {
        const pk = await ledger.getPubKey()
        if (!pk) throw new Error('PubKey is undefined')

        const publicKey = PublicKey.fromAmino({
          type: 'tendermint/PubKeySecp256k1',
          value: pk.toString('base64'),
        })

        const key = new LedgerKey(publicKey)
        signed = await lcd.wallet(key).createAndSignTx({
          ...txOptions,
          signMode: SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
        })
      } else {
        const { privateKey } = getStoredWallet(name!, password)
        const key = new RawKey(Buffer.from(privateKey, 'hex'))
        signed = await lcd.wallet(key).createAndSignTx(txOptions)
      }

      const data = await lcd.tx.broadcastSync(signed)
      const { raw_log, txhash } = data
      const code = isTxError(data) ? data.code : undefined

      const onVerified = (result: object) => {
        setSubmitting(false)
        setSubmitted(true)
        onFinish({
          result,
          success: true,
          password: storePassword ? password : undefined,
        })
      }

      const onError = (message: string) => {
        setSubmitting(false)
        setSubmitted(true)
        setErrorMessage(message)
        onFinish({
          result: data,
          success: false,
          error: { code: 2 /* Tx error */, message },
          password: storePassword ? password : undefined,
        })
      }

      code
        ? onError(raw_log)
        : waitForConfirmation
        ? verifyTx(txhash, onVerified, onError)
        : onVerified(data)
    } catch (error) {
      setSubmitting(false)
      setSubmitted(true)
      setErrorMessage(error.message)
      onFinish({
        success: false,
        error: {
          code: 3,
          message:
            error.response?.data?.error /* error on tx */ ?? error.message,
        },
      })
    }
  }

  const verifyTx = (
    txhash: string,
    onVerified: (tx: TxInfo) => void,
    onError: (message: string) => void
  ) => {
    const iterate = async (until: number) => {
      try {
        const tx = await lcd.tx.txInfo(txhash)
        tx.txhash === txhash && onVerified(tx)
      } catch (error) {
        Date.now() < until
          ? setTimeout(() => iterate(until), 500)
          : onError('Timeout')
      }
    }

    iterate(Date.now() + 20000)
  }

  const onDeny = () => {
    setErrorMessage('User denied.')
    onFinish({
      success: false,
      error: { code: 1 /* User denied */ },
      password: storePassword ? password : undefined,
    })
  }

  /* form */
  const [storePassword, setStorePassword] = useState(false)
  const [password, setPassword] = useState(isPreconfigured(user) ? PW : '')
  const [passwordError, setPasswordError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    extension.storage.local.get(
      ['encrypted', 'timestamp'],
      ({ encrypted, timestamp }) => {
        if (
          encrypted &&
          timestamp &&
          isBefore(new Date(), addHours(new Date(timestamp), 24))
        ) {
          const decrypted = decrypt(encrypted, String(timestamp))
          setStorePassword(true)
          setPassword(decrypted)
        }
      }
    )
  }, [])

  const isSign = requestType === 'sign'

  const title = isSign ? 'Confirm signature' : 'Confirm transaction'
  const label = `${title} with password`

  const passwordField: Field = {
    label,
    element: 'input',
    attrs: {
      type: 'password',
      id: 'password',
      disabled: false,
      value: password,
      placeholder: 'Input your password to confirm',
      autoComplete: 'off',
      autoFocus: true,
    },
    setValue: (v) => {
      setPasswordError(undefined)
      setPassword(v)
    },
    error: passwordError,
  }

  const storePasswordField: Field = {
    label: 'Save password for 24 hour',
    element: 'input',
    attrs: {
      type: 'checkbox',
      id: 'storePassword',
      checked: storePassword,
    },
    setValue: () => {
      setStorePassword(!storePassword)
    },
  }

  /* dangerous tx */
  const { data } = useTerraAssets<
    Dictionary<Dictionary<{ url: string; types: string[] }>>
  >('/msgs/MsgGrantAuthorization.json')
  const GrantAllowed = data?.[network]

  const isDangerousTx = !msgs
    ? false
    : msgs.some((msg) => {
        const data = msg.toData()

        if (data['@type'] !== '/cosmos.authz.v1beta1.MsgGrant') return false
        if (!GrantAllowed) return true

        const { grant, grantee } = data
        const { authorization } = grant
        const allowedTypes = GrantAllowed[grantee].types
        return !allowedTypes.includes(authorization['@type'])
      })

  const disabled = (!user.ledger && !password) || isDangerousTx

  const submit = () => {
    user.ledger || testPassword(name!, password)
      ? { post: postTx, sign: signTx }[requestType]()
      : setPasswordError('Incorrect password')
  }

  const submitLabel = isSign ? 'Sign' : 'Post'

  const form = {
    title,
    fields: !user.ledger ? [passwordField, storePasswordField] : [],
    disabled,
    submitLabel,
    onSubmit: disabled ? undefined : submit,
    submitting,
  }

  const defaultResultProps = { button: 'Sign next transaction' }
  const result = errorMessage
    ? { content: errorMessage, ...defaultResultProps }
    : submitted
    ? { content: 'Success!', ...defaultResultProps }
    : undefined

  const getIsMsgExecuteContract = (msg: Msg) =>
    msg.toData()['@type'] === '/terra.wasm.v1beta1.MsgExecuteContract'

  const isOriginTerra = origin.includes('terra.money')

  const warn = isSign
    ? bytes
      ? 'The origin is signing an arbitrary data.'
      : 'The origin is signing a transaction. This transaction will be routed and processed by the origin. Interact only with origins that you trust.'
    : undefined

  return submitting ? (
    <Submitting />
  ) : (
    <ConfirmationComponent
      form={form}
      result={result}
      pagination={pagination}
      warn={warn}
      onFinish={() => window.location.reload()}
      cancel={{ children: 'Deny', onClick: onDeny }}
    >
      <dl className={c('dl-wrap', s.dl)}>
        <dt>origin</dt>
        <dd>{origin}</dd>
        <dt>timestamp</dt>
        <dd>{formatDistanceToNow(new Date(id))} ago</dd>
        <dt>fee</dt>
        <dd>
          <ul>
            {fee?.amount.toArray().map(({ denom, amount }) => (
              <li key={denom}>
                {format.amount(amount.toString())}{' '}
                {is.ibcDenom(denom) ? (
                  <IBCUnit>{denom}</IBCUnit>
                ) : (
                  format.denom(denom)
                )}
              </li>
            ))}
          </ul>
        </dd>

        {memo && (
          <>
            <dt>Memo</dt>
            <dd>{memo}</dd>
          </>
        )}
      </dl>

      <section>
        {msgs?.map((msg, index) => {
          const isDanger = !(isOriginTerra || getIsMsgExecuteContract(msg))
          return <Message msg={msg} danger={isDanger} />
        })}
      </section>
    </ConfirmationComponent>
  )
}

const Confirm = () => {
  const user = useUser()

  /* extension */
  const { request } = useExtension()
  const { sorted, onFinish } = request

  /* pagination */
  const { current, total, actions } = usePage(sorted.length)
  const currentItem = sorted[current - 1]
  const pagination = (
    <Pagination current={current} length={total} actions={actions} />
  )

  /* response */
  const handleFinish = (params: Partial<ExtSign & { password?: string }>) => {
    const { password, ...rest } = params
    const { requestType, details } = currentItem ?? {}
    currentItem && onFinish(requestType, { ...details, ...rest }, password)
  }

  return !(user && currentItem) ? null : (
    <Component
      {...currentItem}
      user={user}
      onFinish={handleFinish}
      pagination={total > 1 ? pagination : undefined}
    />
  )
}

export default Confirm

/* hooks */
const usePage = (total: number) => {
  const [current, setCurrent] = useState(1)
  const prev = () => setCurrent((n) => (n === 1 ? total : n - 1))
  const next = () => setCurrent((n) => (n === total ? 1 : n + 1))
  return { current, total, actions: [prev, next] }
}

/* helpers */
const parseCreateTxOptions = (
  params: TxOptionsData
): CreateTxOptions | undefined => {
  try {
    const { msgs, fee } = params

    const isProto = '@type' in JSON.parse(msgs[0])

    return {
      ...params,
      msgs: msgs.map((msg) =>
        isProto ? Msg.fromData(JSON.parse(msg)) : Msg.fromAmino(JSON.parse(msg))
      ),
      fee: !fee
        ? undefined
        : isProto
        ? Fee.fromData(JSON.parse(fee))
        : Fee.fromAmino(JSON.parse(fee)),
    }
  } catch {
    return undefined
  }
}
