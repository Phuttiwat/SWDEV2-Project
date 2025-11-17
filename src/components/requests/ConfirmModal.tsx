// components/requests/ConfirmModal.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
};

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    type = 'info'
}: Props) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Handle mounting for portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onCancel]);

    if (!isOpen || !mounted) return null;

    // Get or create modal root
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
    }

    const buttonColor = type === 'danger' 
        ? 'bg-red-500 hover:bg-red-600' 
        : type === 'warning'
        ? 'bg-yellow-500 hover:bg-yellow-600'
        : 'bg-[#232f3e] hover:bg-[#37475a]';

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            style={{ 
                zIndex: 9999,
                paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            } as React.CSSProperties}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onCancel();
                }
            }}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                style={{ 
                    zIndex: 10000,
                    margin: 'auto',
                    maxHeight: 'calc(100vh - 2rem)',
                    overflowY: 'auto'
                }}
            >
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 id="modal-title" className="text-lg font-semibold text-[#232f3e]">
                        {title}
                    </h3>
                </div>
                
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                        {message}
                    </p>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-normal text-[#232f3e] bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-normal text-white rounded transition-colors ${buttonColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, modalRoot);
}

