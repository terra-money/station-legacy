import { LangKey } from '../lib'
import { isExtension } from '../utils/env'
import { languageList, Languages } from '../data/lang'
import { useLang, useManageLanguage } from '../data/lang'
import Select from '../components/Select'
import ConfigSelector from './ConfigSelector'
import s from './Nav.module.scss'

const Lang = () => {
  const current = useLang()
  const { set } = useManageLanguage()

  const languages = languageList.map((key: LangKey) => ({
    label: Languages[key]['name'],
    value: key,
  }))

  return isExtension ? (
    <Select
      value={current}
      onChange={(e) => set(e.target.value)}
      className="form-control"
      containerClassName={isExtension ? s.select : undefined}
    >
      {languages.map(({ label, value }) => (
        <option value={value} key={label}>
          {value}
        </option>
      ))}
    </Select>
  ) : (
    <ConfigSelector
      icon="language"
      title="Select language"
      label={Languages[current]?.['name']}
      value={current}
      onSelect={set}
      options={languages}
    />
  )
}

export default Lang
