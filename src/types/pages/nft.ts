export interface NFTContract {
  contract: string
  symbol: string
  name: string
  icon: string
  homepage: string
  marketplace: string[]
}

export interface NFTMarketplace {
  link: string
  name: string
}

export type NFTContracts = Dictionary<NFTContract>

export interface NFTTokenItem {
  extension: Extension
}

export interface Extension {
  name?: string
  description?: string
  image?: string
  image_data?: string
}
