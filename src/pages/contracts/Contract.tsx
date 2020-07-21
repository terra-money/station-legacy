import React from 'react'
import c from 'classnames'
import { ContractUI } from '@terra-money/use-station'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import ActionBar from '../../components/ActionBar'
import ExtLink from '../../components/ExtLink'
import Card from '../../components/Card'
import Flex from '../../components/Flex'
import Icon from '../../components/Icon'
import Interact from '../../post/Interact'
import Query from '../../post/Query'
import s from '../txs/Tx.module.scss'

const Contract = ({ address, link, date, ...props }: ContractUI) => {
  const { contract, code, interact, query } = props
  const { modal } = useApp()

  const title = (
    <>
      <ExtLink href={link} className={s.address}>
        {address}
      </ExtLink>
      <section className={s.date}>
        <Icon name="date_range" />
        {date}
      </section>
    </>
  )

  return (
    <Card title={title} {...classNames} bordered>
      <Flex className="space-between">
        <ul className={c(s.details, s.meta)}>
          <li>
            <strong>{code.label}</strong>
            <span>{code.value}</span>
          </li>
          <li>
            <strong>{contract.label}</strong>
            <span>{contract.value}</span>
          </li>
        </ul>

        <ActionBar
          list={[
            <ButtonWithAuth
              className="btn btn-outline-primary btn-sm"
              onClick={() => modal.open(<Interact address={address} />)}
            >
              {interact}
            </ButtonWithAuth>,
            <ButtonWithAuth
              className="btn btn-outline-sky btn-sm"
              onClick={() => modal.open(<Query address={address} />)}
            >
              {query}
            </ButtonWithAuth>,
          ]}
        />
      </Flex>
    </Card>
  )
}

export default Contract

/* styles */
const classNames = {
  headerClassName: s.header,
  bodyClassName: s.body,
}
