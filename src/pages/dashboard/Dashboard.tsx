import React from 'react'
import WithAuth from '../../components/WithAuth'
import Card from '../../components/Card'
import Table from '../../components/Table'
import ShowMore from '../../components/ShowMore'

const Dashboard = () => (
  <>
    <div className="row">
      <div className="col">
        <Card title="Tax proceeds">
          ≈ 146.201722 Luna
          <footer>
            <span className="badge badge-light">
              Tax rate 0.1% (Capped at 1 SDT)
            </span>
          </footer>
        </Card>
      </div>

      <div className="col">
        <Card title="Seigniorage">
          102.400210 Luna
          <footer>
            <span className="badge badge-light">In epoch #2</span>
          </footer>
        </Card>
      </div>

      <div className="col">
        <Card title="Coin issuance">
          10,000,000,000 Luna
          <footer>
            <span className="badge badge-primary">LUNA</span>
            <span className="badge badge-light">SDT</span>
            <span className="badge badge-light">KRT</span>
            <span className="badge badge-light">UST</span>
          </footer>
        </Card>
      </div>
    </div>

    <WithAuth>
      <div className="row">
        <div className="col col-4">
          <Card title="Balance" footer={<ShowMore to="/bank" />}>
            <Table>
              <tbody>
                <tr>
                  <th>Luna</th>
                  <td>100,023,445.000000</td>
                </tr>

                <tr>
                  <th>SDT</th>
                  <td>2,400,000.000000</td>
                </tr>

                <tr>
                  <th>KRT</th>
                  <td>30,000,000.000000</td>
                </tr>

                <tr>
                  <th>UST</th>
                  <td>10,000.000000</td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </div>

        <div className="col col-8">
          <Card title="My delegations" footer={<ShowMore to="/" />}>
            (Graph)
          </Card>
        </div>
      </div>

      <Card title="Recent transactons" footer={<ShowMore to="/transactions" />}>
        <article>
          <header>
            <h1>Received 100.100000 Luna</h1>
            <p>
              F01A727BEC84AEDB46818B80FB405ED73AACA58453E9FCC2F0702BD1BD9D5E1C
            </p>
          </header>
          <footer>May 10, 2019 18:29:42</footer>
        </article>

        <article>
          <header>
            <h1>Received 100.100000 Luna</h1>
            <p>
              F01A727BEC84AEDB46818B80FB405ED73AACA58453E9FCC2F0702BD1BD9D5E1C
            </p>
          </header>
          <footer>May 10, 2019 18:29:42</footer>
        </article>

        <article>
          <header>
            <h1>Received 100.100000 Luna</h1>
            <p>
              F01A727BEC84AEDB46818B80FB405ED73AACA58453E9FCC2F0702BD1BD9D5E1C
            </p>
          </header>
          <footer>May 10, 2019 18:29:42</footer>
        </article>
      </Card>
    </WithAuth>
  </>
)

export default Dashboard
