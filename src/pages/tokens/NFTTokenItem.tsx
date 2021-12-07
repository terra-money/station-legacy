import classNames from 'classnames'
import { ReactComponent as Default } from '../../images/CW.svg'
import useFinder from '../../hooks/useFinder'
import { NFTContract } from '../../types'
import { truncate } from '../../utils/format'
import { useManageNFTTokens, useNFTTokens } from '../../data/nftTokens'
import { ExtLinkWithIcon } from '../../components/ExtLink'
import styles from './NFTTokenItem.module.scss'

interface Props extends NFTContract {
  muteOnAdded?: boolean
}

export const NFTTokenItem = ({ muteOnAdded, ...item }: Props) => {
  const { contract, icon, name } = item
  const tokens = useNFTTokens()
  const { add, remove } = useManageNFTTokens()
  const added = !!tokens[contract]
  const getLink = useFinder()

  return (
    <article className={styles.token}>
      <div className={styles.main}>
        <header className={styles.header}>
          {!icon ? (
            <Default width={20} height={20} className={styles.img} />
          ) : (
            <img
              className={styles.img}
              src={icon}
              alt="icon"
              width={20}
              height={20}
            />
          )}

          <h1 className={styles.symbol}>{name}</h1>
        </header>

        <p className={styles.link}>
          <ExtLinkWithIcon href={getLink?.({ q: 'address', v: contract })}>
            {truncate(contract, [6, 6])}
          </ExtLinkWithIcon>
        </p>
      </div>

      {added ? (
        <button
          className={classNames(styles.button, muteOnAdded && styles.muted)}
          onClick={() => remove(contract)}
        >
          {muteOnAdded ? 'Added' : 'Delete'}
        </button>
      ) : (
        <button
          className={styles.button}
          onClick={() => add({ [contract]: item })}
        >
          Add
        </button>
      )}
    </article>
  )
}
