import React from 'react'
import Toast from '../components/Toast'

const Update = ({ title, content, forceUpdate }: VersionWeb) => (
  <Toast
    type={forceUpdate ? 'error' : 'warn'}
    icon="error"
    title={title}
    content={content}
    button={{ onClick: () => window.location.reload(), children: 'Refresh' }}
    shouldNotClose
  />
)

export default Update
