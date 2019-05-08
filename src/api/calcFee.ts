import { times, div, ceil, floor } from './math'

export const GAS_PRICE = '0.015'
export const calcFee = (gas: string): string => ceil(times(gas, GAS_PRICE))
export const calcGas = (fee: string): string => floor(div(fee, GAS_PRICE))
