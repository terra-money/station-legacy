import React from 'react'
import ExtLink from '../components/ExtLink'

const UpdateElectron = ({ version, title, message, ...rest }: Version) => {
  const { macUrl, windowsUrl } = rest
  const links = [
    ['Windows', windowsUrl],
    ['Mac', macUrl],
  ]

  return (
    <article>
      <h1>
        {title} {version}
      </h1>

      <section>
        <p dangerouslySetInnerHTML={{ __html: message }} />

        {links.map(([label, url]) => (
          <ExtLink href={url} className="btn btn-primary" key={label}>
            {label}
          </ExtLink>
        ))}
      </section>
    </article>
  )
}

export default UpdateElectron
