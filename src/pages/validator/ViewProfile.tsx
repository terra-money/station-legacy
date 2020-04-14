import React from 'react'
import validators from '../../validators'
import src from '../../images/ViewProfile.png'
import ExtLink from '../../components/ExtLink'
import styles from './ViewProfile.module.scss'

const PROJECT = 'https://github.com/terra-project/validator-profiles'
const PATH = '/tree/master/validators/'

const ViewProfile = ({ address }: { address: string }) => {
  const link = [PROJECT, PATH, address].join('')
  const size = { width: 190, height: 60 }
  const invalid = !validators[address]

  return invalid ? null : (
    <ExtLink href={link} className={styles.link}>
      <img src={src} {...size} alt="View profile on Terra Validators" />
    </ExtLink>
  )
}

export default ViewProfile
