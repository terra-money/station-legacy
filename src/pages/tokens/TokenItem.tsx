import classNames from 'classnames'
import { Token } from '../../lib'
import useFinder from '../../hooks/useFinder'
import { truncate } from '../../utils/format'
import { useManageTokens, useTokens } from '../../data/tokens'
import { ExtLinkWithIcon } from '../../components/ExtLink'
import styles from './TokenItem.module.scss'

interface Props extends Token {
  muteOnAdded?: boolean
}

export const TokenItem = ({ muteOnAdded, ...item }: Props) => {
  const { token, symbol, decimals, icon } = item
  const tokens = useTokens()
  const { add, remove } = useManageTokens()
  const added = !!tokens[token]
  const getLink = useFinder()

  return (
    <article className={styles.token}>
      <div className={styles.main}>
        <header className={styles.header}>
          {!icon ? (
            <div className={classNames(styles.img, styles.placeholder)} />
          ) : (
            <img
              className={styles.img}
              src={icon}
              alt=""
              width={20}
              height={20}
            />
          )}

          <h1 className={styles.symbol}>{symbol}</h1>
        </header>

        <p className={styles.link}>
          <ExtLinkWithIcon href={getLink?.({ q: 'address', v: token })}>
            {truncate(token, [6, 6])} (decimals: {decimals ?? '6'})
          </ExtLinkWithIcon>
        </p>
      </div>

      {added ? (
        <button
          className={classNames(styles.button, muteOnAdded && styles.muted)}
          onClick={() => remove(token)}
        >
          {muteOnAdded ? 'Added' : 'Delete'}
        </button>
      ) : (
        <button
          className={styles.button}
          onClick={() => add({ [token]: item })}
        >
          Add
        </button>
      )}
    </article>
  )
}
