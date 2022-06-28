import { FC, lazy, useEffect, useState } from 'react'
import { useDynamicScript } from './useDynamicScript'
import { loadComponent } from './loadComponent'

const componentCache = new Map()

interface UseFederatedComponentResult {
  Component: FC<{ containerName?: string }> | null
  errorLoading: boolean
}

/**
 * This is the implementation of the dynamic remote https://github.com/module-federation/module-federation-examples/tree/master/advanced-api/dynamic-remotes
 *
 * @param remoteUrl url to the remote container e.g. http://myhost.com/remoteContainer.js
 * @param scope window scope of the remote container e.g. my_remote_container
 * @param module exposed component e.g. './MyRemoteComponent'
 * @returns UseFederatedComponentResult
 */
export const useFederatedComponent = (remoteUrl: any, scope: any, module: any): UseFederatedComponentResult => {
  const key = `${remoteUrl}-${scope}-${module}`
  const [Component, setComponent] = useState(null)

  const { ready, errorLoading } = useDynamicScript(remoteUrl)
  useEffect(() => {
    if (Component) setComponent(null)
    // Only recalculate when key changes
  }, [key])

  useEffect(() => {
    if (ready && !Component) {
      const Comp = lazy(loadComponent(scope, module))
      componentCache.set(key, Comp)
      setComponent(Comp as any)
    }
    // key includes all dependencies (scope/module)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Component, ready, key])

  return { errorLoading, Component }
}
