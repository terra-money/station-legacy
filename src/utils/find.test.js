import find from './find'

const input = [
  { denom: 'ukrw', available: '3984543276', delegatable: '3984543276' },
  { denom: 'uluna', available: '3331471', delegatable: '3331471' },
  { denom: 'usdr', available: '35398', delegatable: '35398' },
  { denom: 'uusd', available: '651171', delegatable: '651171' }
]

test('find', () => {
  expect(find(input)('uluna')).toEqual(input[1])
})
