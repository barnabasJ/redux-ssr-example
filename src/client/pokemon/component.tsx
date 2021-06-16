import React from 'react'
import { Typography } from '@material-ui/core'

import { useGetPokemonByNameQuery } from './api'

type Props = {
  name: string
}

export function Pokemon({ name }: Props): JSX.Element {
  const { data, isLoading } = useGetPokemonByNameQuery(name)

  return isLoading ? (
    <Typography variant="h6" color="textSecondary">
      Loading...
    </Typography>
  ) : (
    <div>
      <Typography>{data?.['name']}</Typography>
      <img
        src={data?.['sprites']?.front_default}
        alt={`${data?.['name']} sprite`}
      />
    </div>
  )
}
