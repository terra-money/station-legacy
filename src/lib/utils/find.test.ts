import find from './find'

const input = [
  { denom: 'uluna', available: '1' },
  { denom: 'ukrw', available: '2' },
  { denom: 'usdr', available: '3' },
  { denom: 'uusd', available: '4' },
]

describe('find', () => {
  test('uluna:available', () => {
    expect(find('uluna:available', input)).toBe('1')
  })

  test('umnt:available', () => {
    expect(find('umnt:available', input)).toBeUndefined()
  })
})
