import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isTxError } from '@terra-money/terra.js'

import {
  createActionRuleSet,
  getTxCanonicalMsgs,
  createLogMatcherForActions,
} from '@terra-money/log-finder-ruleset'

import { TxsPage, Tx, TxUI } from '../../../types'
import { format } from '../../../utils'
import { useCurrentChainName } from '../../../data/chain'
import useFCD from '../../../api/useFCD'
import useFinder from '../../../hooks/useFinder'

interface Response {
  txs: Tx[]
  limit: number
  next: number
}

export default ({ address }: User): TxsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()
  const currentChainName = useCurrentChainName()

  /* api */
  const [txs, setTxs] = useState<Tx[]>([])
  const [next, setNext] = useState<number>()
  const [offset, setOffset] = useState<number>()
  const [done, setDone] = useState(false)

  const url = '/v1/txs'
  const params = { account: address, offset }
  const response = useFCD<Response>({ url, params })
  const { data } = response

  useEffect(() => {
    if (data) {
      setTxs((txs) => [...txs, ...data.txs])
      setNext(data.next)
      setDone(data.txs.length < data.limit)
    }
  }, [data])

  const more = txs.length && !done ? () => setOffset(next) : undefined

  /* parse */
  const ruleset = createActionRuleSet(currentChainName)
  const logMatcher = createLogMatcherForActions(ruleset)

  const getCanonicalMsgs = (tx: Tx) => {
    const matchedMsg = getTxCanonicalMsgs(JSON.stringify(tx), logMatcher)

    return matchedMsg
      ? matchedMsg
          .map((matchedLog) => matchedLog.map(({ transformed }) => transformed))
          .flat(2)
      : []
  }

  /* render */
  const ui =
    !response.loading && !txs.length
      ? {
          card: {
            title: t('Page:Txs:No transaction history'),
            content: t(
              "Page:Txs:Looks like you haven't made any transaction yet"
            ),
          },
        }
      : {
          more,
          list: txs.map((txItem): TxUI => {
            const { txhash, chainId, timestamp, raw_log, tx } = txItem
            const { fee, memo } = tx.value

            const success = !isTxError(txItem)
            const msgs = getCanonicalMsgs(txItem)

            return {
              link: getLink!({ network: chainId, q: 'tx', v: txhash }),
              hash: txhash,
              date: format.date(timestamp, { toLocale: true }),
              messages: msgs.map((msg) => {
                if (!msg)
                  return {
                    tag: 'Unknown',
                    summary: ['Unknown tx'],
                    success,
                  }

                const tag = msg.msgType.split('/')[1].replaceAll('-', ' ')
                const summary = msg.canonicalMsg
                return { tag, summary, success }
              }),
              details: [
                {
                  title: t('Common:Tx:Tx fee'),
                  content: fee.amount
                    ?.map((coin) => format.coin(coin))
                    .join(', '),
                },
                { title: t('Common:Tx:Memo'), content: memo },
                !success ? { title: 'Log', content: raw_log } : {},
              ].filter(({ content }) => !!content),
            }
          }),
        }

  return Object.assign({ ...response, ui })
}
