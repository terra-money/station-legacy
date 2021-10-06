import { Block } from '@terra-money/terra.js'
import numeral from 'numeral'
import { HeightData } from '../types'
import { useTerraObserver } from '../data/Terra/TerraObserver'
import useFinder from '../hooks/useFinder'

export default (): HeightData | undefined => {
  const getLink = useFinder()
  const { block } = useTerraObserver()

  if (!block) return

  const height = getHeight(block)
  return {
    formatted: `#${numeral(height).format()}`,
    link: getLink({ q: 'blocks', v: height }),
  }
}

/* helpers */
const getHeight = (block: Block) => block.header.height
