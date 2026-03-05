import { createPortal } from 'react-dom'

export default function ConfirmModal({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
    if (!isOpen) return null

    return createPortal(
        <div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="relative card p-6 max-w-sm w-full shadow-2xl shadow-black/50 animate-slide-up border border-ink-700/80">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2
                            id="confirm-modal-title"
                            className="font-display font-bold text-ink-50 text-base mb-1"
                        >
                            {title}
                        </h2>
                        {message && (
                            <p className="text-ink-400 text-sm leading-relaxed">{message}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 mt-6 justify-end">
                    <button
                        onClick={onCancel}
                        className="btn-secondary text-sm px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn-danger text-sm px-4 py-2"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
