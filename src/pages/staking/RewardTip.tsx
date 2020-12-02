import React from 'react'
import s from './RewardTip.module.scss'

interface Props {
  header: string
  contents: string[]
  footer: string
}

const RewardTip = ({ header, contents, footer }: Props) => (
  <article className={s.rewardtip}>
    <h1>{header}</h1>
    <ul className={s.list}>
      {contents.map((content, index) => (
        <li className={s.item} key={index}>
          {content}
        </li>
      ))}
    </ul>
    <footer>{footer}</footer>
  </article>
)

export default RewardTip
