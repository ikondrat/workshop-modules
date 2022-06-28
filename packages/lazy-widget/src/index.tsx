import { FC, Suspense } from 'react'
import { useFederatedComponent } from './helpers/useFederatedComponent'

interface LazyWidgetProps {
  containerURL: string
  containerScope: string

  widget: string

  containerName?: string
}

export const LazyWidget: FC<LazyWidgetProps> = ({ containerURL, containerScope, widget, containerName }) => {
  const { Component, errorLoading } = useFederatedComponent(containerURL, containerScope, widget)

  return (
    <Suspense fallback="">
      {errorLoading || !Component ? `Error loading module "${module}"` : Component && <Component containerName={containerName} />}
    </Suspense>
  )
}
