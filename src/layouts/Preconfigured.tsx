import React, { useState, useEffect } from 'react'
import { useAuth } from '@terra-money/use-station'
import { generateWallet } from '../utils'
import { encryptWallet } from '../utils/localStorage'
import Select from '../components/Select'
import accounts from '../accounts.local.json'

export const PW = '1234567890'

const Preconfigured = ({ className }: { className?: string }) => {
  const { signIn } = useAuth()
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  useEffect(() => {
    const configure = async (i: number) => {
      const { name, mnemonic } = accounts[i]
      const wallet = await generateWallet(mnemonic, 330)
      const key = encryptWallet({ name, password: PW, wallet })
      signIn(key)
    }

    currentIndex > -1 && configure(currentIndex)
    // eslint-disable-next-line
  }, [currentIndex])

  return (
    <Select
      className={className}
      value={String(currentIndex)}
      onChange={(e) => setCurrentIndex(Number(e.target.value))}
    >
      <option value="-1" disabled>
        LocalTerra Accounts
      </option>

      {accounts.map(({ name }, index) => (
        <option value={String(index)} key={index}>
          {name}
        </option>
      ))}
    </Select>
  )
}

export default Preconfigured

/* helpers */
export const isPreconfigured = ({ address }: User) =>
  accounts.findIndex((account) => account.address === address) !== -1
