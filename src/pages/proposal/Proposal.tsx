import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGoBack } from '../../hooks'
import Page from '../../components/Page'
import Card from '../../components/Card'

const Proposal = ({ match }: RouteComponentProps<{ id: string }>) => {
  useGoBack('/governance')
  return (
    <Page title="Proposal Detail">
      <Card></Card>
    </Page>
  )
}

export default Proposal
