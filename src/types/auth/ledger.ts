import { Card, ButtonAttrs } from '..'

export interface ConfirmLedger {
  card: Card
  retry?: Retry
}

export interface Retry {
  attrs: ButtonAttrs
  message: string
}
