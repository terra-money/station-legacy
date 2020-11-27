import React, { useState, Fragment, ReactNode } from 'react'
import c from 'classnames'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {
  CreateTxOptions,
  Msg,
  TxInfo,
  StdFee,
  Key,
  PublicKey,
  StdSignMsg,
  StdSignature,
  StdTx,
} from '@terra-money/terra.js'
import { isTxError } from '@terra-money/terra.js'
import { LCDClient, RawKey } from '@terra-money/terra.js'
import { useAuth, useConfig } from '@terra-money/use-station'
import { Field } from '@terra-money/use-station'
import { testPassword, getStoredWallet } from '../utils/localStorage'
import * as ledger from '../wallet/ledger'
import { useExtension } from './useExtension'
import { ExtSign, RecordedExtSign, TxOptionsData } from './useExtension'
import ConfirmationComponent from '../post/ConfirmationComponent'
import { PW, isPreconfigured } from '../layouts/Preconfigured'
import Pagination from './Pagination'
import Submitting from './Submitting'
import Message from './Message'
import s from './Confirm.module.scss'

interface Props extends RecordedExtSign {
  user: User
  pagination: ReactNode
  onFinish: (params: Partial<ExtSign>) => void
}

class LedgerKey extends Key {
  public sign(): Promise<Buffer> {
    throw new Error(
      'LedgerKey does not use sign() -- use createSignature() directly.'
    )
  }

  public async createSignature(tx: StdSignMsg): Promise<StdSignature> {
    const pubkeyBuffer = await ledger.getPubKey()

    if (!pubkeyBuffer) {
      throw new Error('failed getting public key from ledger')
    }

    const signatureBuffer = await ledger.sign(tx.toJSON())

    if (!signatureBuffer) {
      throw new Error('failed signing from ledger')
    }

    return new StdSignature(
      signatureBuffer.toString('base64'),
      PublicKey.fromData({
        type: 'tendermint/PubKeySecp256k1',
        value: pubkeyBuffer.toString('base64'),
      })
    )
  }
}

const Component = ({ requestType, details, ...props }: Props) => {
  const { user, pagination, onFinish } = props
  const { name } = user
  const { id, origin, gasPrices, ...rest } = details
  const { waitForConfirmation, ...txOptionsData } = rest
  const txOptions = parseCreateTxOptions(txOptionsData)
  const { msgs, memo } = txOptions

  /* chain */
  const { chain } = useConfig()
  const { chainID, lcd: URL } = chain.current
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
        // ledger
        const key = new LedgerKey(await ledger.getPubKey())
        const stdSignMsg = await lcd.wallet(key).createTx(txOptions)
        const stdSignature = await key.createSignature(stdSignMsg)

        result = {
          recid: 0,
          signature: stdSignature.signature,
          public_key: stdSignature.pub_key,
          stdSignMsgData: stdSignMsg.toData(),
        }
      } else {
        const { privateKey } = getStoredWallet(name, password)
        const key = new RawKey(Buffer.from(privateKey, 'hex'))
        const stdSignMsg = await lcd.wallet(key).createTx(txOptions)
        const { signature, recid } = key.ecdsaSign(
          Buffer.from(stdSignMsg.toJSON())
        )

        result = {
          recid,
          signature: Buffer.from(signature).toString('base64'),
          public_key: key.publicKey?.toString('base64'),
          stdSignMsgData: stdSignMsg.toData(),
        }
      }

      onFinish({ result, success: true })
      setSubmitting(false)
      setSubmitted(true)
    } catch (error) {
      setSubmitting(false)
      setSubmitted(true)
      setErrorMessage(error.message)
      onFinish({ success: false })
    }
  }

  /* post tx */
  const postTx = async () => {
    setSubmitting(true)

    try {
      let signed: StdTx

      if (user.ledger) {
        const key = new LedgerKey(await ledger.getPubKey())
        signed = await lcd.wallet(key).createAndSignTx(txOptions)
      } else {
        const { privateKey } = getStoredWallet(name, password)
        const key = new RawKey(Buffer.from(privateKey, 'hex'))
        signed = await lcd.wallet(key).createAndSignTx(txOptions)
      }

      const data = await lcd.tx.broadcastSync(signed)
      const { raw_log, txhash } = data
      const code = isTxError(data) ? data.code : undefined

      const onVerified = (result: object) => {
        setSubmitting(false)
        setSubmitted(true)
        onFinish({ result, success: true })
      }

      const onError = (message: string) => {
        setSubmitting(false)
        setSubmitted(true)
        setErrorMessage(message)
        onFinish({
          result: data,
          success: false,
          error: { code: 2 /* Tx error */, message },
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
          message: error.response
            ? error.response.data?.error /* error on tx */
            : error.message,
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
    onFinish({ success: false, error: { code: 1 /* User denied */ } })
  }

  /* form */
  const [password, setPassword] = useState(isPreconfigured(user) ? PW : '')
  const [passwordError, setPasswordError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const passwordField: Field = {
    label: 'Confirm with password',
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

  const disabled = !user.ledger && !password

  const submit = () => {
    user.ledger || testPassword(name, password)
      ? { post: postTx, sign: signTx }[requestType]()
      : setPasswordError('Incorrect password')
  }

  const form = {
    title: 'Confirm',
    fields: !user.ledger ? [passwordField] : [],
    disabled,
    submitLabel: 'Submit',
    onSubmit: disabled ? undefined : submit,
    submitting,
  }

  const defaultResultProps = { button: 'Sign next transaction' }
  const result = errorMessage
    ? { content: errorMessage, ...defaultResultProps }
    : submitted
    ? { content: 'Success!', ...defaultResultProps }
    : undefined

  return submitting ? (
    <Submitting />
  ) : (
    <ConfirmationComponent
      form={form}
      result={result}
      pagination={pagination}
      onFinish={() => window.location.reload()}
      cancel={{ children: 'Deny', onClick: onDeny }}
    >
      <dl className={c('dl-wrap', s.dl)}>
        <dt>origin</dt>
        <dd>{origin}</dd>
        <dt>timestamp</dt>
        <dd>{formatDistanceToNow(new Date(id))} ago</dd>

        {memo && (
          <>
            <dt>Memo</dt>
            <dd>{memo}</dd>
          </>
        )}
      </dl>

      <section>
        {msgs.map((msg, index) => (
          <Message msg={msg} key={index} />
        ))}
      </section>
    </ConfirmationComponent>
  )
}

const Confirm = () => {
  const { user } = useAuth()

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
  const handleFinish = (params: Partial<ExtSign>) => {
    const { requestType, details } = currentItem ?? {}
    currentItem && onFinish(requestType, { ...details, ...params })
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
const parseCreateTxOptions = (params: TxOptionsData): CreateTxOptions => {
  const { msgs, fee } = params
  return {
    ...params,
    msgs: msgs.map((msg) => Msg.fromData(JSON.parse(msg))),
    fee: fee ? StdFee.fromData(JSON.parse(fee)) : undefined,
  }
}

/* render */
export const getDl = (object: object): { dt: string; dd: string }[] =>
  Object.entries(object).map(([k, v]) => ({
    dt: k,
    dd: typeof v === 'object' ? JSON.stringify(v, null, 2) : v,
  }))
