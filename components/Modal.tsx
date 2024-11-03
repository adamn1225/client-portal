import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 w-full bg-gray-600 dark:bg-gray-300 dark:bg-opacity-50 bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white dark:bg-slate-900 dark:text-slate-100 rounded-lg shadow-lg p-6 w-full max-w-4xl h-min">
                <div className="flex justify-end">
                    <button className="text-gray-600 dark:text-white text-2xl" onClick={onClose}>
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;