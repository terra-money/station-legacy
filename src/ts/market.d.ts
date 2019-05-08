type RateList = (Rate & Variation)[]

interface Rate {
  denom: string
  swaprate: string
}

interface Variation {
  oneDayVariation: string
  oneDayVariationRate: string
}
