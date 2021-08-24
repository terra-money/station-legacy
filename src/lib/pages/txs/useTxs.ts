import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TxsPage, User, Tx } from '../../types'
import { format } from '../../utils'
import useFCD from '../../api/useFCD'
import useWhitelist from '../../cw20/useWhitelist'
import { useConfig } from '../../contexts/ConfigContext'
import useFinder from '../../hooks/useFinder'
import useContracts from '../../hooks/useContracts'
import { LIMIT } from '../constants'

const TERRA_ADDRESS_REGEX = /(terra1[a-z0-9]{38})/g

export default ({ address }: User): TxsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()
  const { chain } = useConfig()
  const { name: currentChain } = chain.current
  const { whitelist } = useWhitelist(currentChain)
  const { contracts } = useContracts(currentChain)

  /* api */
  const [txs, setTxs] = useState<Tx[]>([])
  const [offset, setOffset] = useState<number>()
  const [done, setDone] = useState(false)

  const url = '/v1/msgs'
  const params = { account: address, limit: LIMIT, offset }
  const response = useFCD<{ txs: Tx[] }>({ url, params })
  const { data } = response

  useEffect(() => {
    if (data) {
      setTxs((txs) => [...txs, ...data.txs])
      setDone(data.txs.length < LIMIT)
    }
  }, [data])

  const more =
    txs.length && !done ? () => setOffset(txs[txs.length - 1].id) : undefined

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
          list: txs.map(({ chainId, txhash, timestamp, msgs, ...tx }) => {
            const { success, txFee, memo, errorMessage } = tx
            return {
              link: getLink!({ network: chainId, q: 'tx', v: txhash }),
              hash: txhash,
              date: format.date(timestamp, { toLocale: true }),
              messages: msgs.map(({ tag, text }) => {
                const replacer = (addr: string) => {
                  const token = whitelist?.[addr]
                  const contract = contracts?.[addr]

                  return contract
                    ? [contract.protocol, contract.name].join(' ')
                    : token
                    ? token.symbol
                    : addr
                }

                return {
                  tag: t('Page:Txs:' + tag),
                  text: text.replace(TERRA_ADDRESS_REGEX, replacer),
                  success,
                }
              }),
              details: [
                {
                  title: t('Common:Tx:Tx fee'),
                  content: txFee?.map((coin) => format.coin(coin)).join(', '),
                },
                { title: t('Common:Tx:Memo'), content: memo },
                { title: t('Common:Tx:Log'), content: errorMessage },
              ].filter(({ content }) => !!content),
            }
          }),
        }

  return Object.assign({ ...response, ui })
}
