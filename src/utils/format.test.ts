import format from './format'

describe('format', () => {
  test('amount', () => {
    expect(format.amount(1000000000)).toBe('1,000.000000')
    expect(format.amount('890597')).toBe('0.890597')
    expect(format.amount('80971135550')).toBe('80,971.135550')
  })

  test('denom', () => {
    expect(format.denom('uluna')).toBe('Luna')
    expect(format.denom('ukrw')).toBe('KRT')
  })

  describe('coin', () => {
    test.each`
      coin                                        | string
      ${{ amount: '1000000000', denom: 'uluna' }} | ${'1,000.000000 Luna'}
    `('$coin', ({ coin, string }) => {
      expect(format.coin(coin)).toBe(string)
    })
  })

  test('decimal', () => {
    expect(format.decimal(0.123456789)).toBe('0.123456')
  })

  test('truncate', () => {
    const address = 'terra1srw9p49fa46fw6asp0ttrr3cj8evmj3098jdej'
    expect(format.truncate(address, [9, 7])).toBe('terra1srw…098jdej')
  })
})
