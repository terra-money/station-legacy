import { runCustomImageDataParsers } from './nftImageDataParser'

describe('nftImageDataParser', () => {
  describe('runCustomImageDataParsers', () => {
    const mockContract = 'terra1mockcontractaddress'
    const lunaPunkContract = 'terra1qfy2nfr0zh70jyr3h4ns9rzqx4fl8rxpf09ytv'
    const imageData = '<svg></svg>'
    it('should return undefined if empty values returned', () => {
      const parsedImage = runCustomImageDataParsers()
      console.log(parsedImage)
      expect(parsedImage).toBeUndefined()
    })
    it('should return undefined if image data has value but empty contract', () => {
      const parsedImage = runCustomImageDataParsers(imageData)
      console.log(parsedImage)
      expect(parsedImage).toBeUndefined()
    })
    it('should return undefined if image data has value but not part of custom parser contract', () => {
      const parsedImage = runCustomImageDataParsers(imageData, mockContract)
      console.log(parsedImage)
      expect(parsedImage).toBeUndefined()
    })
    it('should return run custom parser if parsed LunaPunk contract', () => {
      const parsedImage = runCustomImageDataParsers(imageData, lunaPunkContract)
      console.log(parsedImage)
      expect(parsedImage).not.toBeUndefined()
    })
  })
})
