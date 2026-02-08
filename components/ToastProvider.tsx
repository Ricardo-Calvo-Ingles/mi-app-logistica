import React, { useState, useCallback, createContext, useContext } from 'react';
import { Toast } from './ui/Toast';

interface ToastMessage {
    id: number;
    message: string;
}

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string) => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2 w-full max-w-xs sm:max-w-sm">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        onDismiss={() => dismissToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};