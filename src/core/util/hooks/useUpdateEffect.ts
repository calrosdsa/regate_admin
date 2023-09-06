import { DependencyList, EffectCallback, useEffect, useRef } from 'react'


function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const isFirst = useIsFirstRender()

  useEffect(() => {
    if (!isFirst) {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useUpdateEffect

function useIsFirstRender(): boolean {
    const isFirst = useRef(true)
  
    if (isFirst.current) {
      isFirst.current = false
  
      return true
    }
  
    return isFirst.current
  }
  