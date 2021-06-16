import React from 'react'
import Typography from '@material-ui/core/Typography'

import { Pokemon } from './pokemon'
import { StoreProvider } from './store/provider'
import { Store } from './store'

type Props = {
  store?: Store
}

export function App({ store }: Props): JSX.Element {
  return (
    <StoreProvider store={store}>
      <Typography variant="h2" color="primary" component="h1">
        React Test
      </Typography>
      <Pokemon name="bulbasaur" />
    </StoreProvider>
  )
}
