import { setupListeners } from '@reduxjs/toolkit/dist/query'
import React, { ReactNode, useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { initStore, RootState, Store } from './store'

type Props = {
  children?: ReactNode
  store?: Store
}

const preloadedState: Partial<RootState> | undefined =
  typeof window !== 'undefined' ? window?.__PRELOADED_STATE__ : undefined

export function StoreProvider({ children, store }: Props): JSX.Element {
  const [savedStore] = useState(store || initStore(preloadedState))

  useEffect(() => setupListeners(savedStore.dispatch), [savedStore])

  savedStore.dispatch({ type: 'Test' })

  return <ReduxProvider store={savedStore}>{children}</ReduxProvider>
}
