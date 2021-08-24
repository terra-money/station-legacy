import { AxiosError } from 'axios'
import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  handleError?: (error: Error, errorInfo: ErrorInfo) => void
  fallback?: ReactNode
}

class ErrorBoundary extends Component<Props> {
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

export default ErrorBoundary

/* helpers */
export const FORBIDDEN =
  'Your IP has been flagged for potential security violations. Please change your network configuration.'

export const getIsForbidden = (error: Error | AxiosError) =>
  'response' in error && error.response?.status === 403
