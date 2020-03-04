import * as Sentry from '@sentry/browser'
import { isLocal } from './env'

const verbose = (error: Error) => {
  console.group('Sentry')
  console.error(error)
  console.groupEnd()
}

export default (error: Error) => {
  isLocal ? verbose(error) : Sentry.captureException(error)
}
