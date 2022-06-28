/// <reference types="react-scripts" />

declare module 'app_account/App' {
  const App: React.ComponentType

  export default App
}

declare module 'app_invest/App' {
  const App: React.ComponentType

  export default App
}

declare module 'app_sell/App' {
  const App: React.ComponentType

  export default App
}

declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    DIST: string

    REACT_APP_ACCOUNT_REF: string
    REACT_APP_INVEST_REF: string
    REACT_APP_SELL_REF: string
  }
}
