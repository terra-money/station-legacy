import { paste } from './helpers'

describe('paste', () => {
  test('1', () => {
    const input = ['a', 'b', 'c', 'd', 'e', '']
    const output = ['a', 'x', 'y', 'z', 'e', '']
    expect(paste(1, ['x', 'y', 'z'], input)).toEqual(output)
  })

  test('2', () => {
    const input = ['a', 'b', 'c', 'd', 'e', '']
    const output = ['a', 'b', 'c', 'd', 'x', 'y']
    expect(paste(4, ['x', 'y', 'z'], input)).toEqual(output)
  })
})
