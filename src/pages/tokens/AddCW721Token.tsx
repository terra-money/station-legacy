import { useEffect, useState } from 'react'
import { AccAddress } from '@terra-money/terra.js'
import useLCD from '../../api/useLCD'
import useCW721Whitelist from '../../cw721/useCW721Whitelist'
import ModalContent from '../../components/ModalContent'
import Icon from '../../components/Icon'
import { NFTContract, NFTContracts } from '../../types'
import NFTTokens from './NFTTokens'
import styles from './AddCW721Token.module.scss'

const AddCW721Token = () => {
  const { whitelist, isLoading } = useCW721Whitelist()
  const lcd = useLCD()
  const [input, setInput] = useState('')
  const [results, setResults] = useState<NFTContracts>({})

  const filter = ({ contract, symbol, name }: NFTContract) =>
    symbol?.toLowerCase().includes(input.toLowerCase()) ||
    name.toLowerCase().includes(input.toLowerCase()) ||
    (AccAddress.validate(input) && contract.includes(input))

  useEffect(() => {
    const search = async (token: string) => {
      try {
        const info = await lcd.wasm.contractQuery<NFTContract>(token, {
          contract_info: {},
        })

        const contract = info.contract || input
        setResults((prev) => ({
          ...prev,
          [token]: { ...info, token: token, contract },
        }))
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

      <ul className={styles.list}>
        <NFTTokens
          contracts={
            result
              ? [result]
              : shuffle(Object.values(whitelist ?? {})).filter(filter)
          }
          muteOnAdded
        />
      </ul>
    </ModalContent>
  )
}

export default AddCW721Token

/* Fisher–Yates Shuffle */
function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex--)
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
