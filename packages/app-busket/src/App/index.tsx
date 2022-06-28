import 'regenerator-runtime/runtime'
import React, { FC } from 'react'

export const AppContainer: FC<{ containerName?: string }> = ({ containerName }) => {

  return (
    <div>App busket (container: {containerName})</div>
  )
}

export default AppContainer
