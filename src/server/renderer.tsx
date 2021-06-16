import { join } from 'path'
import { readFile } from 'fs'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Response, Request } from 'express'
import { ServerStyleSheets } from '@material-ui/styles'

import { getDataFromTree } from './getDataFromTree'

import { staticPath } from '.'

import { App } from '@client/app'
import { initStore } from '@client/store'

export async function renderer(_: Request, res: Response): Promise<void> {
  readFile(join(staticPath, 'index.html'), 'utf8', async (err, data) => {
    if (err) {
      console.error('could not read index file', err)
      res.status(500).send('could not read index file')
    }

    const store = await getDataFromTree(
      (middleware) => initStore({}, middleware),
      App
    )

    const styleSheet = new ServerStyleSheets()
    const app = renderToString(styleSheet.collect(<App store={store} />))

    res.send(
      data
        .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
        .replace(
          '<style id="mui-styles"></style>',
          `<style id="mui-styles">${styleSheet.toString()}</style>`
        )
    )
  })
}
