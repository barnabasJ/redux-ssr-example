import React, { ReactNode, useEffect } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'

import { theme } from './theme'

type Props = {
  children?: ReactNode
}

export function ThemeProvider({ children }: Props): JSX.Element {
  /**
   * hydrate material-ui's css
   * @see https://material-ui.com/guides/server-rendering/#the-client-side
   */
  useEffect(() => {
    const jssStyles = document.querySelector('#mui-styles')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
