import { OracleData } from '../types'
import useFCD from './useFCD'

export default () => {
  const response = useFCD<OracleData>({ url: '/oracle/denoms/actives' })
  return response
}
