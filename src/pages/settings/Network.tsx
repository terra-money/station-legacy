import React, { useState } from 'react'
import classNames from 'classnames/bind'
import { useConfig } from '../../lib'
import { localSettings } from '../../utils/localStorage'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import useMergeChains, { useDeleteNetwork } from './useMergeChains'
import AddNetwork from './AddNetwork'
import styles from './Network.module.scss'

const cx = classNames.bind(styles)

const Network = () => {
  const chains = useMergeChains()
  const deleteNetwork = useDeleteNetwork()
  const [selected, setSelected] = useState<string | undefined>()
  const { customNetworks = [] } = localSettings.get()
  const { chain } = useConfig()

  const addNetwork = () => {
    setSelected(undefined)
  }

  return (
    <Page
      title="Network"
      action={
        <button className="btn btn-primary btn-sm" onClick={addNetwork}>
          Add a network
        </button>
      }
    >
      <Card>
        <div className={styles.component}>
          <nav className={styles.nav}>
            <ul className={styles.list}>
              {Object.entries(chains).map(([key, { name, chainID }]) => (
                <li
                  className={cx(styles.item, { selected: key === selected })}
                  key={key}
                >
                  <button
                    className={styles.button}
                    onClick={() => setSelected(key)}
                  >
                    <span className={styles.id}>{name}</span>
                    {chainID}
                    <Icon name="chevron_right" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <section className={styles.main}>
            {selected ? (
              <>
                <pre className={styles.pre}>
                  {JSON.stringify(chains[selected], null, 2)}
                </pre>

                <div className={styles.actions}>
                  {customNetworks.some(({ name }) => name === selected) && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteNetwork(selected)}
                      disabled={chain.current.name === selected}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            ) : (
              <AddNetwork />
            )}
          </section>
        </div>
      </Card>
    </Page>
  )
}

export default Network
