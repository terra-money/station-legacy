import { FC, Component, ReactNode, ErrorInfo } from 'react'
import { AxiosError } from 'axios'
import { useText } from '../lib'

interface ErrorBoundaryComponentProps {
  handleError?: (error: Error, errorInfo: ErrorInfo) => void
  fallback?: ReactNode
}

export class ErrorBoundaryComponent extends Component<ErrorBoundaryComponentProps> {
  state = { hasError: null, isForbidden: false }
  static getDerivedStateFromError = () => ({ hasError: true })

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ isForbidden: error && getIsForbidden(error) })
    this.props.handleError?.(error, errorInfo)
  }

  render() {
    const { fallback = null, children } = this.props
    const { hasError, isForbidden } = this.state
    return hasError ? (isForbidden ? FORBIDDEN : fallback) : children
  }
}

/* helpers */
export const FORBIDDEN =
  'Your IP has been flagged for potential security violations. Please change your network configuration.'

export const getIsForbidden = (error: Error | AxiosError) =>
  'response' in error && error.response?.status === 403

interface ErrorBoundaryProps {
  fallback?: ReactNode
}

const ErrorBoundary: FC<ErrorBoundaryProps> = ({ fallback, children }) => {
  const { OOPS } = useText()

  return (
    <ErrorBoundaryComponent fallback={fallback ?? OOPS}>
      {children}
    </ErrorBoundaryComponent>
  )
}

export default ErrorBoundary
