import { useState, useEffect } from 'react'

// Module-level singleton — survives page navigation, no React Provider needed
let _preview = sessionStorage.getItem('altus_pro_preview') === 'true'
const _subs = new Set()

export function getProPreview() {
    return _preview
}

export function setGlobalProPreview(val) {
    _preview = val
    sessionStorage.setItem('altus_pro_preview', String(val))
    _subs.forEach((fn) => fn(val))
}

// Drop this hook into any component. Reacts instantly when dashboard toggles preview.
export function useProPreview() {
    const [val, setVal] = useState(_preview)
    useEffect(() => {
        _subs.add(setVal)
        return () => _subs.delete(setVal)
    }, [])
    return [val, setGlobalProPreview]
}