import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { isTxError } from '@terra-money/terra.js'
import { Coins, LCDClient, Fee, Tx, SignatureV2 } from '@terra-money/terra.js'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { ConfirmProps, ConfirmPage, Sign, Field, GetKey } from '../../types'
import { PostResult, PostError } from '../../types'
import useInfo from '../../lang/useInfo'
import { useCurrentChain } from '../../data/chain'
import fcd from '../../api/fcd'
import { format } from '../../utils'
import { toInput, toAmount } from '../../utils/format'
import { lt, gt, toNumber } from '../../utils/math'
import { useCalcFee } from './txHelpers'
import { checkError, parseError } from './txHelpers'

interface SignParams {
  user: User
  password?: string
  getKey: GetKey
  sign: Sign
}

const DEFAULT_GAS_ADJUSTMENT = 1.75

export default (
  { memo, submitLabels, message, onFinish, ...rest }: ConfirmProps,
  { user, password: defaultPassword = '', getKey }: SignParams
): ConfirmPage => {
  const { contents, msgs, tax, feeDenom, validate, warning, parseResult } = rest
  const gasAdjustment = rest.gasAdjustment ?? DEFAULT_GAS_ADJUSTMENT

  const { t } = useTranslation()
  const { ERROR } = useInfo()
  const { name, ledger, address } = user

  const SUCCESS = {
    title: t('Post:Confirm:Success!'),
    button: t('Common:Form:Ok'),
  }

  /* error */
  const defaultErrorMessage = t('Common:Error:Oops! Something went wrong')
  const [simulatedErrorMessage, setSimulatedErrorMessage] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const { chainID, lcd: URL } = useCurrentChain()

  /* fee */
  const getFeeDenom = (gas: string) => {
    const { defaultValue, list } = feeDenom
    const available = list.filter((denom) => {
      const amount = calcFee ? calcFee.feeFromGas(gas, denom) : gas
      return validate({ amount, denom })
    })

    return defaultValue ?? available[0]
  }

  const [input, setInput] = useState<string>(toInput('1'))
  const [denom, setDenom] = useState<string>(() => getFeeDenom('1'))
  const [estimated, setEstimated] = useState<string>()
  const fee = { amount: toAmount(input), denom }
  const calcFee = useCalcFee()
  const readyToSimulate = !!calcFee

  /* simulate */
  const [simulating, setSimulating] = useState(true)
  const [simulated, setSimulated] = useState(false)
  const [unsignedTx, setUnsignedTx] = useState<Tx>()
  const [gas, setGas] = useState('0')
  const isGasEstimated = gt(gas, 0)

  useEffect(() => {
    isGasEstimated && setDenom(getFeeDenom(gas))
    // eslint-disable-next-line
  }, [isGasEstimated])

  useEffect(() => {
    const simulate = async () => {
      try {
        setSimulated(false)
        setSimulating(true)
        setEstimated(undefined)
        setErrorMessage(undefined)

        const gasPrices = { [denom]: calcFee!.gasPrice(denom) }
        const lcd = new LCDClient({ chainID, URL, gasPrices })
        const options = { msgs, feeDenoms: [denom], memo, gasAdjustment }
        const unsignedTx = await lcd.tx.create([{ address }], options)
        setUnsignedTx(unsignedTx)

        const gas = String(unsignedTx.auth_info.fee.gas_limit)
        const estimatedFee = calcFee!.feeFromGas(gas, denom)
        setGas(gas)
        setInput(toInput(estimatedFee ?? '0'))
        setEstimated(estimatedFee)
        setSimulated(true)
      } catch (error) {
        setSimulatedErrorMessage(
          parseError(error as PostError, defaultErrorMessage)
        )
      } finally {
        setSimulating(false)
      }
    }

    readyToSimulate && simulate()

    // eslint-disable-next-line
  }, [readyToSimulate])

  useEffect(() => {
    const setFee = () => {
      const estimatedFee = calcFee!.feeFromGas(gas, denom)
      setInput(toInput(estimatedFee ?? '0'))
      setEstimated(estimatedFee)
    }

    readyToSimulate && setFee()

    // eslint-disable-next-line
  }, [denom, readyToSimulate])

  /* submit */
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<PostResult>()
  const [txhash, setTxHash] = useState<string>()

  const connected = useConnectedWallet()

  const submit = async () => {
    if (!unsignedTx) return

    try {
      setLedgerError(undefined)
      setSubmitting(true)
      setErrorMessage(undefined)

      const broadcast = async (signedTx: Tx) => {
        const { gasPrices } = calcFee!
        const lcd = new LCDClient({ chainID, URL, gasPrices })

        const data = await lcd.tx.broadcastSync(signedTx)
        isTxError(data)
          ? setErrorMessage(checkError(data.raw_log))
          : setTxHash(data.txhash)
      }

      const gasFee = new Coins({ [fee.denom]: fee.amount })
      const fees = tax ? gasFee.add(tax) : gasFee
      unsignedTx.auth_info.fee = new Fee(
        toNumber(unsignedTx.auth_info.fee.gas_limit),
        fees
      )

      if (connected) {
        const { result } = await connected.post({
          msgs,
          fee: new Fee(toNumber(unsignedTx.auth_info.fee.gas_limit), fees),
          memo,
          gas,
          gasPrices: { [denom]: calcFee!.gasPrice(denom) },
          gasAdjustment,
          feeDenoms: [denom],
        })
        setTxHash(result.txhash)
      } else {
        const key = await getKey(name ? { name, password } : undefined)
        const gasPrices = { [denom]: calcFee!.gasPrice(denom) }
        const lcd = new LCDClient({ chainID, URL, gasPrices })
        const wallet = lcd.wallet(key)
        const { account_number, sequence } =
          await wallet.accountNumberAndSequence()

        const signed = await key.signTx(unsignedTx, {
          chainID,
          sequence,
          signMode: name
            ? SignatureV2.SignMode.SIGN_MODE_DIRECT
            : SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
          accountNumber: account_number,
        })

        await broadcast(signed)
      }
    } catch (error) {
      const { name, message } = error as PostError

      if (message === 'Incorrect password') {
        setPasswordError(t('Auth:Form:Incorrect password'))
      } else if (name === 'LedgerError') {
        setLedgerError(message)
      } else {
        setErrorMessage(parseError(error as PostError, defaultErrorMessage))
      }
    } finally {
      setSubmitting(false)
      onFinish?.()
    }
  }

  const pollResult = usePollTxHash(txhash ?? '')
  useEffect(() => {
    if (pollResult?.height) {
      setResult(pollResult)
      const errorMessage = checkError(pollResult.raw_log)
      errorMessage ? setErrorMessage(errorMessage) : setSubmitted(true)
    }
  }, [pollResult])

  const readyToSubmit = simulated && !submitting
  const valid = gt(fee.amount, 0) && validate(fee)

  /* ledger */
  const [confirming, setConfirming] = useState(false)
  const [ledgerError, setLedgerError] = useState<string>()

  /* password */
  const [password, setPassword] = useState(defaultPassword)
  const [passwordError, setPasswordError] = useState<string>()
  const passwordField: Field = {
    label: t('Post:Confirm:Confirm with password'),
    element: 'input',
    attrs: {
      type: 'password',
      id: 'password',
      disabled: !readyToSubmit || !valid,
      value: password,
      placeholder: t('Post:Confirm:Input your password to confirm'),
      autoComplete: 'off',
      autoFocus: true,
    },
    setValue: (v) => {
      setPasswordError(undefined)
      setPassword(v)
    },
    error: passwordError,
  }

  const disabled = !readyToSubmit || !valid || !(!name || password)
  const onSubmit = () => {
    ledger && setConfirming(true)
    submit()
  }

  return {
    contents,

    fee: {
      label: t('Common:Tx:Fee'),
      status: simulating ? t('Post:Confirm:Simulating...') : undefined,
      select: {
        options: feeDenom.list.map((denom) => ({
          value: denom,
          children: format.denom(denom),
          disabled: !validate({
            amount: calcFee ? calcFee.feeFromGas(gas, denom) : gas,
            denom,
          }),
        })),
        attrs: { id: 'denom', value: denom, disabled: !readyToSubmit },
        setValue: (value: string) => setDenom(value),
      },
      input: {
        attrs: {
          id: 'input',
          value: input,
          disabled: !readyToSubmit || !denom,
        },
        setValue: (value: string) => setInput(value),
      },
      message:
        estimated && lt(fee.amount, estimated)
          ? t(
              'Post:Confirm:Recommended fee is {{fee}} or higher.\nTransactions with low fee might fail to proceed.',
              { fee: format.coin({ amount: estimated, denom: fee.denom }) }
            )
          : undefined,
    },

    form: {
      title: t('Common:Form:Confirm'),
      fields: name ? [passwordField] : [],
      errors: ([] as string[])
        .concat(warning ?? [])
        .concat(
          simulated && !valid
            ? t(
                "Post:Confirm:You don't have enough balance. Please adjust either the amount or the fee."
              )
            : []
        ),
      disabled,
      submitLabel: ledger
        ? t('Post:Confirm:Confirm with ledger')
        : submitting
        ? submitLabels[1]
        : submitLabels[0],
      onSubmit: disabled ? undefined : onSubmit,
      submitting,
    },

    ledger: confirming
      ? {
          card: {
            title: t('Post:Confirm:Confirm with ledger'),
            content: t('Post:Confirm:Please confirm in your\nLedger Wallet'),
          },
          retry: ledgerError
            ? {
                attrs: { onClick: submit, children: t('Common:Form:Retry') },
                message: ledgerError,
              }
            : undefined,
        }
      : undefined,

    result: simulatedErrorMessage
      ? { ...ERROR, content: simulatedErrorMessage }
      : errorMessage
      ? { ...ERROR, content: errorMessage }
      : submitted
      ? { ...SUCCESS, content: (result && parseResult?.(result)) ?? message }
      : undefined,

    txhash,
  }
}

/* hooks */
export const usePollTxHash = (txhash: string) => {
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false)
  const { data } = useQuery(txhash, () => fcd.get(`/v1/tx/${txhash}`), {
    refetchInterval,
    enabled: !!txhash,
  })

  const result = data?.data
  const height = result && result.height

  useEffect(() => {
    if (height) {
      setRefetchInterval(false)
    } else {
      setRefetchInterval(1000)
    }
  }, [height])

  return result
}
