import React from 'react'
import Icon from '../components/Icon'
import Flex from '../components/Flex'
import s from './Guide.module.scss'

const Guid = () => (
  <div className={s.component}>
    <Flex>
      <Icon name="help" />
      Guide PDF
    </Flex>

    <div>
      <a href="https://terra.money/static/Terra_Station_Guide_Eng.pdf" download>
        ENG
      </a>
      <a href="https://terra.money/static/Terra_Station_Guide_Kor.pdf" download>
        KOR
      </a>
    </div>
  </div>
)

export default Guid
