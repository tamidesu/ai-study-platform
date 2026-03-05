import { createContext, useCallback, useContext, useReducer } from 'react'
import { createPortal } from 'react-dom'

const ToastContext = createContext(null)

const ICONS = {
    success: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    error: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    info: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
        </svg>
    ),
}

const STYLES = {
    success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/15 border-red-500/30 text-red-300',
    info: 'bg-primary-500/15 border-primary-500/30 text-primary-300',
}

let nextId = 0

function reducer(state, action) {
    switch (action.type) {
        case 'ADD': return [...state, action.toast]
        case 'REMOVE': return state.filter(t => t.id !== action.id)
        default: return state
    }
}

function ToastItem({ toast, dispatch }) {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl text-sm font-medium animate-slide-up ${STYLES[toast.type]}`}
        >
            {ICONS[toast.type]}
            <span className="flex-1">{toast.message}</span>
            <button
                onClick={() => dispatch({ type: 'REMOVE', id: toast.id })}
                className="opacity-60 hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                aria-label="Dismiss"
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    )
}

export function ToastProvider({ children }) {
    const [toasts, dispatch] = useReducer(reducer, [])

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++nextId
        dispatch({ type: 'ADD', toast: { id, message, type } })
        setTimeout(() => dispatch({ type: 'REMOVE', id }), duration)
    }, [])

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            {createPortal(
                <div
                    className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
                    aria-live="polite"
                    aria-atomic="false"
                >
                    {toasts.map(toast => (
                        <div key={toast.id} className="pointer-events-auto">
                            <ToastItem toast={toast} dispatch={dispatch} />
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside ToastProvider')
    return ctx
}
