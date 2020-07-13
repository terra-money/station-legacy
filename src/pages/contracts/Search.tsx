import React, { useState, ChangeEvent, FormEvent } from 'react'
import Icon from '../../components/Icon'
import s from './Search.module.scss'

interface Props {
  placeholder?: string
  submit: (value: string) => void
}

const Search = ({ placeholder, submit }: Props) => {
  const [input, handleChange] = useSearch()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit(input)
  }

  return (
    <form onSubmit={handleSubmit} className={s.wrapper}>
      <input value={input} onChange={handleChange} placeholder={placeholder} />
      <button type="submit">
        <Icon name="search" size={20} />
      </button>
    </form>
  )
}

export default Search

/* form */
type Change = (e: ChangeEvent<HTMLInputElement>) => void
const useSearch = (): [string, Change] => {
  const [input, setInput] = useState('')

  const handleChange: Change = (e) => {
    const search = e.target.value
    setInput(search)
  }

  return [input, handleChange]
}
