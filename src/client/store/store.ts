import { configureStore } from '@reduxjs/toolkit'
import type { Middleware, StateFromReducersMapObject } from '@reduxjs/toolkit'
import concat from 'lodash/concat'

import { pokemonApi } from '../pokemon'

const reducer = {
  [pokemonApi.reducerPath]: pokemonApi.reducer,
}

export function initStore(
  preloadedState?: Partial<RootState>,
  middlewares?: Middleware[] | Middleware
) {
  return configureStore({
    preloadedState,
    reducer,
    middleware: (getDefaultMiddleware) =>
      concat(getDefaultMiddleware(), pokemonApi.middleware, middlewares || []),
  })
}

export type Store = ReturnType<typeof initStore>
export type RootState = StateFromReducersMapObject<typeof reducer>
