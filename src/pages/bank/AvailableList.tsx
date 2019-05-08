import React, { useState } from 'react'
import { gte } from '../../api/math'
import Card from '../../components/Card'
import Checkbox from '../../components/Checkbox'
import Available from './Available'

const AvailableList = ({ list }: { list: Balance[] }) => {
  const [hide, setHide] = useState<boolean>(false)

  return (
    <Card
      title="Available"
      actions={
        <Checkbox onClick={() => setHide(!hide)} checked={hide}>
          Hide small balances
        </Checkbox>
      }
    >
      {list
        .filter(({ available }) => !hide || gte(available, '100000'))
        .map((a, i) => (
          <Available {...a} key={i} />
        ))}
    </Card>
  )
}

export default AvailableList
