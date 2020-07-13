import React from 'react'
import { useInfo } from '@terra-money/use-station'
import Logo from '../images/LocalTerraLogo.png'
import ModalContent from '../components/ModalContent'
import Confirm from '../components/Confirm'
import ExtLink from '../components/ExtLink'

const LocalTerraError = ({ modal }: { modal: Modal }) => {
  const { LOCALTERRA_ERROR } = useInfo()
  return (
    <ModalContent {...modal}>
      <Confirm
        {...LOCALTERRA_ERROR}
        image={{ src: Logo, width: 60, height: 60 }}
        footer={
          <ExtLink
            href="https://github.com/terra-project/localterra"
            className="btn btn-primary btn-block"
          >
            {LOCALTERRA_ERROR.button}
          </ExtLink>
        }
      />
    </ModalContent>
  )
}

export default LocalTerraError
