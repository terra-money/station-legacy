import { parseError } from './error'
import sample from './error.sample.json'

describe('parseError', () => {
  test('0', () => {
    const expected = {
      codespace: 'sdk',
      code: 12,
      message:
        'out of gas in location: ReadFlat; gasWanted: 33333, gasUsed: 33964'
    }

    expect(parseError(sample[0])).toEqual(expected)
  })

  test('1', () => {
    const expected = {
      codespace: 'staking',
      code: 102,
      message:
        'too many unbonding delegation entries in this delegator/validator duo, please wait for some entries to mature'
    }

    expect(parseError(sample[1])).toEqual(expected)
  })

  test('falsy', () => {
    expect(parseError(undefined)).toEqual({})
    expect(parseError(null)).toEqual({})
  })
})
