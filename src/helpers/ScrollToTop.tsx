import React, { useEffect, FC } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

const ScrollToTop: FC<RouteComponentProps> = ({ children, location }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return <>{children}</> || null
}

export default withRouter(ScrollToTop)
