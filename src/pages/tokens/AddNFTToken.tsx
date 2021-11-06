import { AccAddress } from '@terra-money/terra.js'
import { useEffect, useState } from 'react'
import { Token, Whitelist } from '../../lib'
import useLCD from '../../api/useLCD'
import useWhitelist from '../../cw721/useWhitelist'
import ModalContent from '../../components/ModalContent'
import Icon from '../../components/Icon'
import styles from './AddToken.module.scss'
import NFTTokens from './NFTTokens'

const AddNFTToken = () => {
  const { whitelist, isLoading } = useWhitelist()
  const lcd = useLCD()
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Whitelist>({})

  console.log(whitelist)
  const filter = ({ token, symbol }: Token) =>
    symbol.toLowerCase().includes(input.toLowerCase()) ||
    (AccAddress.validate(input) && token.includes(input))

  useEffect(() => {
    const search = async (token: string) => {
      try {
        const info = await lcd.wasm.contractQuery<Token>(token, {
          contract_info: {},
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

  return isLoading ? null : (
    <ModalContent>
      <h1 className="modal-title">Add NFT token</h1>

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
          <NFTTokens
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

export default AddNFTToken
