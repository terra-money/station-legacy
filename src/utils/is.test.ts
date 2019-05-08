import is from './is'

describe('is', () => {
  const coin = { amount: '1', denom: 'uluna' }
  describe('coin', () => {
    test.each`
      input            | output
      ${undefined}     | ${false}
      ${true}          | ${false}
      ${1}             | ${false}
      ${''}            | ${false}
      ${[null]}        | ${false}
      ${{ amount: 1 }} | ${false}
      ${null}          | ${true}
      ${coin}          | ${true}
      ${[coin, coin]}  | ${true}
    `('$input', ({ input, output }) => {
      expect(is.coin(input)).toBe(output)
    })
  })
})
