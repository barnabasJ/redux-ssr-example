import React from 'react'
import type { AnyAction, Middleware, Dispatch } from '@reduxjs/toolkit'
import { renderToStaticMarkup } from 'react-dom/server'
import endsWith from 'lodash/endsWith'
import noop from 'lodash/noop'

import { Store } from '@client/store'

export async function getDataFromTree(
  storeFn: (middleWare: Middleware) => Store,
  App: ({ store }: { store: Store }) => JSX.Element,
  renderFn = renderToStaticMarkup
) {
  const middlewareControls = createQueryMiddleWare()
  const store = storeFn(middlewareControls.middleware)
  await _getDataFromTree(middlewareControls, () =>
    renderFn(<App store={store} />)
  )

  return store
}

function createQueryMiddleWare() {
  let resolve: ((v?: unknown) => void) | null = null
  let reject: ((v?: unknown) => void) | null = null
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  let onQueryStarted = noop

  const state = {
    pendingQueries: 0,
    renderComplete: false,
    queryStarted: false,
  }

  const timeout = setTimeout(() => {
    reject?.()
  }, 5000)

  return {
    renderStart: () => {
      state.queryStarted = false
      state.renderComplete = false
    },
    renderDone: () => {
      state.renderComplete = true
    },
    onQueryStarted: (callback: (n?: number) => void) => {
      onQueryStarted = callback
    },
    middleware: () => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
      next(action)

      if (typeof action.type === 'string') {
        if (endsWith(action.type, 'executeQuery/pending')) {
          onQueryStarted(++state.pendingQueries)
        } else if (
          endsWith(action.type, 'executeQuery/fulfilled') ||
          endsWith(action.type, 'executeQuery/rejected')
        ) {
          if (state.renderComplete && --state.pendingQueries == 0) {
            clearTimeout(timeout)
            resolve?.()
          }
        }
      }
    },
    promise,
    state,
  }
}

async function _getDataFromTree(
  middlewareControls: ReturnType<typeof createQueryMiddleWare>,
  renderFn: () => void
) {
  let queryStarted = false
  middlewareControls.onQueryStarted(() => (queryStarted = true))
  middlewareControls.renderStart()
  renderFn()
  middlewareControls.renderDone()
  await middlewareControls.promise

  if (queryStarted) {
    _getDataFromTree(middlewareControls, renderFn)
  }
}
