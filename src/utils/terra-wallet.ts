import { MnemonicKey } from '@terra-money/terra.js'
import { Bip, Wallet, Address } from '@terra-money/use-station'

export const generateSeed = (): string => {
  const mk = new MnemonicKey()
  return mk.mnemonic
}

export const generateAddresses = async (
  phrase: string
): Promise<[Address, Address]> => {
  const mk118 = new MnemonicKey({ mnemonic: phrase, coinType: 118 })
  const mk330 = new MnemonicKey({ mnemonic: phrase, coinType: 330 })
  return [mk118.accAddress, mk330.accAddress]
}

export const generateWallet = async (
  phrase: string,
  bip: Bip
): Promise<Wallet> => {
  const mk = new MnemonicKey({ mnemonic: phrase, coinType: bip })

  return {
    privateKey: mk.privateKey.toString('hex'),
    publicKey: mk.publicKey?.toString('hex') ?? '',
    terraAddress: mk.accAddress,
  }
}
