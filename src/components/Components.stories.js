import React from 'react'
import { storiesOf } from '@storybook/react'

storiesOf('Components', module)
  .add('Buttons', () => (
    <article>
      <p>
        <button className="btn btn-primary">Primary Button</button>
      </p>
      <p>
        <button className="btn btn-primary" disabled>
          Primary Button
        </button>
      </p>
      <p>
        <a href="/" className="btn btn-primary">
          Primary Button
        </a>
      </p>
    </article>
  ))
  .add('Forms', () => (
    <form>
      <label className="label">Amount</label>
      <input className="form-control" />
      <p class="invalid-feedback">Amount must be between 1 and 100</p>
    </form>
  ))
