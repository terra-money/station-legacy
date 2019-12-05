import * as Sentry from '@sentry/browser'
import { isLocal } from '../helpers/env'

type Input = { [key: string]: any }
type Output = { message?: string }

export const parseError = (data: Input): Output => {
  try {
    const { error = '', message } = data || {}

    if (message) {
      return data
    } else {
      const parsed = typeof error === 'string' ? JSON.parse(error) : error
      return Array.isArray(parsed) ? JSON.parse(parsed[0].log) : parsed
    }
  } catch (error) {
    return {}
  }
}

const verbose = (error: Error) => {
  console.group('Sentry')
  console.error(error)
  console.groupEnd()
}

export default (error: Error) => {
  isLocal ? verbose(error) : Sentry.captureException(error)
}
