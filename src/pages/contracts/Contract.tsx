import React from 'react'
import { ContractUI } from '@terra-money/use-station'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import ActionBar from '../../components/ActionBar'
import Card from '../../components/Card'
import Flex from '../../components/Flex'
import Interact from '../../post/Interact'
import Query from '../../post/Query'

const Contract = ({ address, interact, query }: ContractUI) => {
  const { modal } = useApp()

  return (
    <Card small>
      <Flex className="space-between">
        {address}
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
