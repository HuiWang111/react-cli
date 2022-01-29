import { useEffect, EffectCallback } from 'react'

export const useMount = (effect: EffectCallback): void => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, [])
}
