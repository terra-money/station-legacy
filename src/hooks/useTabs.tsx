import React, { useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import c from 'classnames'
import useSearch from './useSearch'

export default (name: string, tabs: { key: string; label: string }[]) => {
  const { pathname } = useLocation()
  const history = useHistory()
  const [sp, getNextSearch] = useSearch()

  /* unmount: init url */
  useEffect(() => {
    const initial = getNextSearch([
      [name, ''],
      ['page', ''],
    ])

    return () => history.replace(initial)
    // eslint-disable-next-line
  }, [])

  /* render: tab */
  const renderTab = ({ key, label }: { key: string; label: string }) => {
    const next = getNextSearch([
      [name, key],
      ['page', ''],
    ])

    const isCurrent = key === currentTab
    const className = c('badge', isCurrent && 'badge-primary')
    const attrs = { className, children: label, key }
    const to = { pathname, search: next }
    return isCurrent ? <span {...attrs} /> : <Link to={to} {...attrs} />
  }

  /* return */
  const currentTab = sp.get(name) || ''
  return {
    currentTab,
    page: Number(sp.get('page')) || 1,
    renderTabs: () => <section className="tabs">{tabs.map(renderTab)}</section>,
    getLink: (page: number) => ({
      pathname,
      search: getNextSearch([['page', String(page)]]),
    }),
  }
}
