import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom'
import { LazyWidget } from '@modules/lazy-widget'

const routes = {
  home: '/',
  busket: '/busket',
  help: '/help',
  profile: '/profile',
}

export const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={routes.home}>
        <Redirect to={routes.busket} />
      </Route>
      <Route path={routes.busket}>
        <LazyWidget
          containerURL='http://localhost:3101/remoteEntry.js'
          containerScope="app_busket"
          widget="./App"
          containerName="smth"
        />
      </Route>
    </Switch>
  </BrowserRouter>
)
