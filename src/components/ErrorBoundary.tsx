import React, { FC, ReactNode, ErrorInfo } from 'react'
import * as Sentry from '@sentry/browser'
import { ErrorBoundary as Component, useText } from '@terra-money/use-station'

interface Props {
  fallback?: ReactNode
}

const ErrorBoundary: FC<Props> = ({ fallback, children }) => {
  const { OOPS } = useText()

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo as any)
      Sentry.captureException(error)
    })
  }

  return (
    <Component fallback={fallback ?? OOPS} handleError={handleError}>
      {children}
    </Component>
  )
}

export default ErrorBoundary
