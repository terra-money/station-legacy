import { Component, ReactNode } from 'react'
import * as Sentry from '@sentry/browser'
import { OOPS } from '../helpers/constants'

type Props = { fallback?: ReactNode }
class ErrorBoundary extends Component<Props> {
  state = { hasError: null }
  static getDerivedStateFromError = () => ({ hasError: true })

  componentDidCatch(error: Error, errorInfo: { [key: string]: any }) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo)
      Sentry.captureException(error)
    })
  }

  render() {
    const { fallback = OOPS, children } = this.props
    const { hasError } = this.state
    return hasError ? fallback : children
  }
}

export default ErrorBoundary
