import c from 'classnames'
import Pop from '../components/Pop'
import Icon from '../components/Icon'
import s from './ConfigSelector.module.scss'

interface OptionProps {
  icon?: string
  label: string
  className?: string
  caret?: boolean
  active?: boolean
}

const Option = ({ icon, label, caret, active, className }: OptionProps) => (
  <div className={c(s.option, className)}>
    <section>
      {icon && <Icon name={icon} className={s.icon} />}
      {label}
    </section>

    {caret ? (
      <Icon name="arrow_drop_down" />
    ) : (
      <div className={s.radio}>{active && <div className={s.active} />}</div>
    )}
  </div>
)

interface Props {
  icon?: string
  label: string
  value: string
  title: string
  options: { label: string; value: string }[]
  onSelect: (value: string) => void
}

const ConfigSelector = ({ icon, label, value, title, ...props }: Props) => {
  const { options, onSelect } = props

  const list = options.map(({ label, ...option }) => (
    <li className={s.item} key={option.value}>
      <button className={s.button} onClick={() => onSelect(option.value)}>
        <Option label={label} active={option.value === value} />
      </button>
    </li>
  ))

  return (
    <Pop
      type="pop"
      placement="top"
      width={200}
      content={
        <article>
          <h1>{title}</h1>
          <ul className={s.list}>{list}</ul>
        </article>
      }
      fixed
    >
      {({ ref, getAttrs }) => (
        <span {...getAttrs({ className: s.wrapper })} ref={ref}>
          <Option icon={icon} label={label} className={s.select} caret />
        </span>
      )}
    </Pop>
  )
}

export default ConfigSelector
