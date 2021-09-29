import { AccAddress } from '@terra-money/terra.js'
import { useEffect, useState } from 'react'
import { Token, Whitelist } from '../../lib'
import useLCD from '../../api/useLCD'
import useWhitelist from '../../cw20/useWhitelist'
import ModalContent from '../../components/ModalContent'
import Icon from '../../components/Icon'
import Tokens from './Tokens'
import styles from './AddToken.module.scss'

const AddToken = () => {
  const { whitelist, loading } = useWhitelist()
  const lcd = useLCD()
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Whitelist>({})

  const filter = ({ token, symbol }: Token) =>
    symbol.toLowerCase().includes(input.toLowerCase()) ||
    (AccAddress.validate(input) && token.includes(input))

  useEffect(() => {
    const search = async (token: string) => {
      try {
        const info = await lcd.wasm.contractQuery<Token>(token, {
          token_info: {},
        })

        setResults((prev) => ({ ...prev, [token]: { ...info, token: token } }))
      } catch (error) {}
    }

    const isInWhitelist = Object.keys(whitelist ?? {}).includes(input)

    if (AccAddress.validate(input) && !isInWhitelist) {
      search(input)
    }
  }, [input, lcd, whitelist])

  /* render */
  const result = results[input]

  return loading ? null : (
    <ModalContent>
      <h1 className="modal-title">Add token</h1>

      <section className={styles.wrapper}>
        <input
          className={styles.search}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search symbol or address..."
        />

        <Icon name="search" />
      </section>

      {input && (
        <ul className={styles.list}>
          <Tokens
            tokens={
              result ? [result] : Object.values(whitelist ?? {}).filter(filter)
            }
            muteOnAdded
          />
        </ul>
      )}
    </ModalContent>
  )
}

export default AddToken
