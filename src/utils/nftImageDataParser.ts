// Custom image parse handling. Advisable to whitelist individual contract after testing due to security of external source

// LunaPunks custom parser
const checkLunaPunkImage = (imageData?: string, contract?: string) => {
  const LUNAPUNKS_CONTRACT = 'terra1qfy2nfr0zh70jyr3h4ns9rzqx4fl8rxpf09ytv'
  if (contract !== LUNAPUNKS_CONTRACT || !imageData) return
  const svgSplitString = imageData.split('viewBox')
  const svg = svgSplitString[0].concat(
    "xmlns='http://www.w3.org/2000/svg' viewBox",
    svgSplitString[1]
  )
  return 'data:image/svg+xml,'.concat(svg)
}

const customImageDataParsers = [checkLunaPunkImage]

// Main runner to parse through various custom parsers.
export const runCustomImageDataParsers = (
  imageData?: string,
  contract?: string
) => {
  let final
  customImageDataParsers.forEach((parser) => {
    const parsed = parser(imageData, contract)
    if (parsed) final = parsed
  })
  return final
}
