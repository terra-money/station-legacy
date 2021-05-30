# Terra Station

![Banner](Logo.png)

**Terra Station** is a web application to interact with [Terra Core](https://github.com/terra-money/core).

Terra Station allows users to:

- Create wallets and send tokens
- Get involved with staking, with looking through validator information and delegating Luna tokens
- A dashboard monitoring key Terra macroeconomic variables
- Atomically swap currencies on the Terra network at the effective on-chain exchange rate.

## Running Terra Station with useStation locally

This guide explains how you can set up Terra Station repositories for local development.
​
### Add `local.terra.money` to `/etc/hosts`
​
This will prevent any CORS issues when using API calls.
​
Add the following entry to your `/etc/hosts` file:
​
```
127.0.0.1 local.terra.money
```

### Build Terra Station

```sh
git clone https://github.com/terra-money/station.git
cd station
cp src/chains.sample.ts src/chains.ts
git submodule init
git submodule update
yarn
yarn start
```

> :warning: For Windows user, you need to change the `SASS_PATH` inside your `.env` file.
> The value must be `SASS_PATH=./node_modules;./src/styles`

Terra Station should now be running locally at https://local.terra.money:3000.

> :mortar_board: You need to change your host file to be able to access `local.terra.money` locally.

#### Customizing [useStation](https://github.com/terra-money/use-station)

You may want to modify the `useStation` to change how Terra Station works.
​
```sh
git clone https://github.com/terra-money/use-station.git
cd use-station
yarn
yarn build
```

Then, to build Terra Station:

```sh
git clone https://github.com/terra-money/station.git
cd station
yarn
yarn add ..path/to/your/use-station
yarn start
```
​
### Building Terra Station (Electron App)

Before executing the following commands, make sure the server of Terra Station(web)
is running, which provides instructions on how to run the Electron app.
​
```sh
git clone https://github.com/terra-money/station-electron.git
cd station-electron
git checkout -t origin/local
yarn
yarn start
```
​
An Electron app should now be running against https://local.terra.money:3000.
You can now launch the app version of Terra Station.

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

### `yarn test`

Launches the test runner in the interactive watch mode.
