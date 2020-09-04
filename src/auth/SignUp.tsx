import React from 'react'
import { generateSeed } from '../utils'
import Recover from './Recover'

const SignUp = () => <Recover generated={generateSeed().split(' ')} />

export default SignUp
