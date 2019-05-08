import React from 'react'

const Version = ({ version, title, message, macUrl, windowsUrl }: Version) => (
  <article>
    <h1>
      {title} {version}
    </h1>

    <section>
      <p dangerouslySetInnerHTML={{ __html: message }} />

      {[['Windows', windowsUrl], ['Mac', macUrl]].map(([label, url]) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          key={label}
        >
          {label}
        </a>
      ))}
    </section>
  </article>
)

export default Version
