import React from 'react'
import c from 'classnames'
import s from './AppUpdate.module.scss'
import Icon from '../components/Icon'

const AppUpdate = ({ title, content, forceUpdate }: VersionWeb) => (
  <article className={c(s.component, forceUpdate ? s.error : s.warn)}>
    <header>
      <section>
        <Icon name="error" />
        <h1>{title}</h1>
      </section>
    </header>

    <p>
      {content}
      <button onClick={() => window.location.reload()}>Refresh</button>
    </p>
  </article>
)

export default AppUpdate
