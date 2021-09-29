/* Fisher–Yates Shuffle */
export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex--)
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

export const paste = (index: number, next: string[], list: string[]) => {
  const head = list.slice(0, index)
  const tail = list.slice(index + next.length)
  return [...head, ...next, ...tail].slice(0, list.length)
}
