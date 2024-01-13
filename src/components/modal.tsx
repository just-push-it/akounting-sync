import { use, useEffect, useState } from "react"

export type ModalProps = {
    open: boolean
    closeOnEscape?: boolean
    closeOnClickOutside?: boolean
    onClose?: () => void
    children: React.ReactNode
}

export const Modal = (props: ModalProps) => {
    useEffect(() => {
        if (props.closeOnEscape) {
            const handler = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    if (props.onClose) props.onClose();
                }
            }
            window.addEventListener("keydown", handler);
            return () => window.removeEventListener("keydown", handler);
        }
    }, [props.closeOnEscape])

    useEffect(() => {
        if (props.closeOnClickOutside) {
            const handler = (event: MouseEvent) => {
                if (event.target === event.currentTarget) {
                    if (props.onClose) props.onClose();
                }
            }
            window.addEventListener("click", handler);
            return () => window.removeEventListener("click", handler);
        }
    }, [props.closeOnClickOutside])

    if (!props.open) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div
                    className="inline-block align-bottom bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    {props.children}
                </div>
            </div>
        </div>
    )
}