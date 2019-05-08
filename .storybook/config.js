import { addDecorator, configure } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { withKnobs } from '@storybook/addon-knobs'
import '../src/index.scss'
import './index.css'

const req = require.context('../src/components', true, /\.stories\.js$/)
const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

addDecorator(withInfo({ inline: true, header: false }))
addDecorator(withKnobs)
configure(loadStories, module)
