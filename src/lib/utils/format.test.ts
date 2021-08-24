import * as format from './format'

describe('format', () => {
  test('decimal', () => {
    expect(format.decimal()).toBe(format.decimal('0'))
    expect(format.decimal('0.123456789')).toBe('0.123456')
  })

  test('amount', () => {
    expect(format.amount('1')).toBe('0.000001')
    expect(format.amount('1234567', 6, { integer: true })).toBe('1')
  })

  test('denom', () => {
    expect(format.denom('uluna')).toBe('Luna')
    expect(format.denom('usdr')).toBe('SDT')
    expect(format.denom('uusd')).toBe('UST')
    expect(format.denom('ukrw')).toBe('KRT')
    expect(format.denom('umnt')).toBe('MNT')
    expect(format.denom('ua')).toBe('')
    expect(format.denom('uab')).toBe('')
    expect(format.denom('uabc')).toBe('')
    expect(format.denom('uabcd')).toBe('')
  })

  test('display', () => {
    const display = format.display({ amount: '1234567890.1', denom: 'uluna' })
    expect(display).toEqual({ value: '1,234.567890', unit: 'Luna' })
  })

  test('coin', () => {
    const coin = { amount: '1234567890', denom: 'uluna' }
    const config = { integer: true }
    expect(format.coin(coin, 6, config)).toBe('1,234 Luna')
  })

  test('input/amount', () => {
    expect(format.toAmount('1.234567890')).toBe('1234567')
    expect(format.toAmount('')).toBe('0')
    expect(format.toInput('1234567.890')).toBe('1.234567')
    expect(format.toInput('')).toBe('0')
  })

  test('truncate', () => {
    const address = 'terra1srw9p49fa46fw6asp0ttrr3cj8evmj3098jdej'
    expect(format.truncate(address, [9, 7])).toBe('terra1srw...098jdej')
  })

  test('sanitizeJSON', () => {
    const string = `{
  "a": true
}`
    expect(format.sanitizeJSON(string)).toBe('{"a":true}')
  })
})
