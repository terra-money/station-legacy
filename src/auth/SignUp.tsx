import React from 'react'
import { electron } from '../utils'
import Recover from './Recover'

const SignUp = () => (
  <Recover generated={electron<string>('generateSeed').split(' ')} />
)

export default SignUp
