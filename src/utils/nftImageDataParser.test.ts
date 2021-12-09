import { runCustomImageDataParsers } from './nftImageDataParser'

describe('nftImageDataParser', () => {
  describe('runCustomImageDataParsers', () => {
    const mockContract = 'terra1mockcontractaddress'
    const lunaPunkContract = 'terra1qfy2nfr0zh70jyr3h4ns9rzqx4fl8rxpf09ytv'
    const imageData = '<svg></svg>'
    it('should return undefined if empty values returned', () => {
      expect(runCustomImageDataParsers()).toBeUndefined()
    })
    it('should return undefined if image data has value but empty contract', () => {
      expect(runCustomImageDataParsers(imageData)).toBeUndefined()
    })
    it('should return undefined if image data has value but not part of custom parser contract', () => {
      expect(runCustomImageDataParsers(imageData, mockContract)).toBeUndefined()
    })
    it('should return run custom parser if parsed LunaPunk contract', () => {
      expect(
        runCustomImageDataParsers(imageData, lunaPunkContract)
      ).not.toBeUndefined()
    })
  })
})
