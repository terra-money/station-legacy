import React, { useState } from 'react'
import classNames from 'classnames/bind'
import { localSettings } from '../../utils/localStorage'
import { Chains } from '../../chains'
import { useApp } from '../../hooks'
import Page from '../../components/Page'
import Card from '../../components/Card'
import AddNetwork from './AddNetwork'
import useMergeChains from './useMergeChains'
import styles from './Network.module.scss'

const cx = classNames.bind(styles)

const Network = () => {
  const { refresh } = useApp()
  const { chains, list } = useMergeChains()
  const [selected, setSelected] = useState<string | undefined>()

  const addNetwork = () => {
    setSelected(undefined)
  }

  const deleteNetwork = (key: string) => {
    const { customNetworks = [] } = localSettings.get()
    localSettings.set({
      customNetworks: customNetworks.filter((item) => item.key !== key),
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
            {list.map(({ title, list }) =>
              list.map((key) => (
                <li key={key}>
                  <button
                    className={cx(styles.item, { selected: key === selected })}
                    onClick={() => setSelected(key)}
                  >
                    {key} ({title})
                  </button>
                </li>
              ))
            )}
          </nav>

          <section className={styles.main}>
            {selected ? (
              <>
                <pre>{JSON.stringify(chains[selected], null, 2)}</pre>
                {!Object.keys(Chains).includes(selected) && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteNetwork(selected)}
                  >
                    Delete
                  </button>
                )}
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
