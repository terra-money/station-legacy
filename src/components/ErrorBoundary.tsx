import React, { FC, ReactNode } from 'react'
import * as Sentry from '@sentry/browser'
import { ErrorBoundary as Component, useText } from '@terra-money/use-station'

interface Props {
  fallback?: ReactNode
}

const ErrorBoundary: FC<Props> = ({ fallback, children }) => {
  const { OOPS } = useText()

  const handleError = (error: Error, errorInfo: object) => {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo)
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
