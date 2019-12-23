import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useHistory } from 'react-router-dom'
import URLSearchParams from '@ungap/url-search-params'
import c from 'classnames'

export default (name: string, tabs: string[]) => {
  const { t } = useTranslation()
  const { search, pathname } = useLocation()
  const history = useHistory()

  /* helper: URL */
  const getSearch = () => new URLSearchParams(search)
  const getNextSearch = (entries: string[][]) => {
    const sp = getSearch()
    entries.forEach(([key, value]) =>
      value ? sp.set(key, value) : sp.delete(key)
    )

    return `?${sp.toString()}`
  }

  /* unmount: init url */
  useEffect(() => {
    const initial = getNextSearch([
      [name, ''],
      ['page', '']
    ])

    return () => history.replace(initial)
    // eslint-disable-next-line
  }, [])

  /* render: tab */
  const renderTab = (tab: string) => {
    const next = getNextSearch([
      [name, tab],
      ['page', '']
    ])

    const isCurrent = tab === currentTab
    const className = c('badge', isCurrent && 'badge-primary')
    const attrs = { className, children: t(tab) || t('all'), key: tab }
    const to = { pathname, search: next }
    return isCurrent ? <span {...attrs} /> : <Link to={to} {...attrs} />
  }

  /* return */
  const currentTab = getSearch().get(name) || ''
  return {
    currentTab,
    page: getSearch().get('page') || '1',
    renderTabs: () => <section className="tabs">{tabs.map(renderTab)}</section>,
    getLink: (page: string) => ({
      pathname,
      search: getNextSearch([['page', page]])
    })
  }
}
