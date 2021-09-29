import { useRef, useEffect, useState } from 'react'
import { FocusEvent, ChangeEvent, ReactNode } from 'react'
import c from 'classnames'
import numeral from 'numeral'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import { Field as FieldProps } from '../lib'
import Icon from './Icon'
import Copy from './Copy'
import Select from './Select'
import MaxButton from './MaxButton'
import InvalidFeedback from './InvalidFeedback'
import s from './Field.module.scss'

interface Props {
  field: FieldProps
  focus?: boolean
  className?: { select?: string; checkbox?: string }
  onFocus?: (e: FocusEvent) => void
  render?: (field: FieldProps) => ReactNode
}

const Field = ({ field, focus, onFocus, render, ...props }: Props) => {
  const { label, element, attrs, setValue, error } = field
  const { copy, button, unit, options, ui } = field
  const isCheckbox = ['checkbox', 'radio'].includes(attrs.type!)
  const className = isCheckbox ? 'form-check' : 'form-group'

  /* focus by external */
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    focus && inputRef.current!.focus()
  }, [focus])

  const handleWheel = () => {
    inputRef.current?.blur()
  }

  /* event */
  type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const handleChange = (e: ChangeEvent<InputElement>) => {
    setValue?.(e.target.value)
  }

  const [file, setFile] = useState<File>()

  useEffect(() => {
    const handleFile = async (file: File) => {
      const encoded = await toBase64(file)
      setValue?.(encoded)
    }

    attrs.name === 'wasm' &&
      (file ? handleFile(file) : setValue && setValue(''))
    // eslint-disable-next-line
  }, [file])

  /* render */
  const header = label && (
    <div className="flex space-between">
      <label className="label" htmlFor={attrs.id}>
        {label}
      </label>

      {copy && (
        <Copy
          text={copy}
          classNames={{ button: 'label-button text-secondary' }}
        />
      )}

      {button && (
        <p className="label-text">
          <MaxButton {...button} />
        </p>
      )}
    </div>
  )

  const input = (
    <input
      {...attrs}
      className="form-control"
      onChange={handleChange}
      onFocus={onFocus}
      onWheel={handleWheel}
      ref={inputRef}
    />
  )

  const inputGroup = (
    <div className="input-group">
      {input}
      <div className="input-group-append">
        <span className="input-group-text">{unit}</span>
      </div>
    </div>
  )

  const checkbox = (
    <>
      <input {...attrs} className="form-check-input" onChange={handleChange} />

      <label
        className={c('form-check-label', props.className?.checkbox)}
        htmlFor={attrs.id}
      >
        {label}
      </label>
    </>
  )

  const aceEditor = (
    <AceEditor
      {...attrs}
      {...AceProps}
      className="form-control"
      onChange={setValue}
      onLoad={(editor) => {
        editor.renderer.setPadding(15)
        editor.renderer.setScrollMargin(15, 15, 15, 15)
      }}
    />
  )

  const fileGroup = (
    <>
      <label className="label" htmlFor={attrs.id}>
        {label}
      </label>
      <label className={c('form-control', s.file)} htmlFor="file">
        <Icon name="cloud_upload" /> {file?.name ?? attrs.placeholder}
      </label>
      <input
        id="file"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0])}
        hidden
      />
      <input {...attrs} readOnly hidden />
      {file && (
        <p className={s.size}>
          <strong>{ui.size}:</strong> {numeral(file.size).format('0b')}
        </p>
      )}
    </>
  )

  const elements = {
    input: () =>
      attrs.name === 'wasm' ? (
        fileGroup
      ) : ['checkbox', 'radio'].includes(attrs.type!) ? (
        checkbox
      ) : (
        <>
          {header}
          {!unit ? input : inputGroup}
          {error && <InvalidFeedback tooltip>{error}</InvalidFeedback>}
        </>
      ),
    select: () => (
      <>
        {header}
        <Select
          {...attrs}
          onChange={handleChange}
          className={c('form-control', props.className?.select)}
        >
          {options?.map((option) => (
            <option {...option} key={option.value} />
          ))}
        </Select>
      </>
    ),
    textarea: () => (
      <>
        {header}
        {attrs.name === 'json' ? (
          aceEditor
        ) : (
          <textarea
            {...attrs}
            className="form-control"
            onChange={handleChange}
            rows={3}
          />
        )}
        {error && <InvalidFeedback tooltip>{error}</InvalidFeedback>}
      </>
    ),
  }

  const renderElement = elements[element]

  return (
    <>
      {render?.(field) ??
        (label ? (
          <div className={className}>{renderElement()}</div>
        ) : (
          renderElement()
        ))}
    </>
  )
}

export default Field

/* utils */
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '') ?? ''
      if (encoded.length % 4 > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4))
      }
      resolve(encoded)
    }
    reader.onerror = (error) => reject(error)
  })

const AceProps = {
  mode: 'json',
  theme: 'github',
  name: 'JSON',
  width: '100%',
  height: '80px',
  showGutter: false,
  highlightActiveLine: false,
  editorProps: { $blockScrolling: true },
}
