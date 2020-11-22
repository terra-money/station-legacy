import React, { useState } from 'react'
import classNames from 'classnames/bind'
import { localSettings } from '../../utils/localStorage'
import { Chains } from '../../chains'
import { useApp } from '../../hooks'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import AddNetwork from './AddNetwork'
import useMergeChains from './useMergeChains'
import styles from './Network.module.scss'

const cx = classNames.bind(styles)

const Network = () => {
  const { refresh } = useApp()
  const chains = useMergeChains()
  const [selected, setSelected] = useState<string | undefined>()

  const addNetwork = () => {
    setSelected(undefined)
  }

  const deleteNetwork = (name: string) => {
    const { customNetworks = [] } = localSettings.get()
    localSettings.set({
      customNetworks: customNetworks.filter((item) => item.name !== name),
    })
    refresh()
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
                  {!Object.keys(Chains).includes(selected) && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteNetwork(selected)}
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
