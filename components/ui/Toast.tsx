import React, { useEffect, useState } from 'react';
import { XIcon } from '../icons';

interface ToastProps {
    message: string;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for fade-out animation to complete before calling dismiss
            setTimeout(onDismiss, 300); 
        }, 4000); // 4 seconds visible

        return () => clearTimeout(timer);
    }, [onDismiss]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
    };

    return (
        <div
            className={`
                bg-green-600 text-white rounded-md shadow-lg p-4 flex items-center justify-between
                transition-all duration-300 ease-in-out transform
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
        >
            <span>{message}</span>
            <button onClick={handleDismiss} className="ml-4 p-1 rounded-full hover:bg-green-700">
                <XIcon className="h-4 w-4" />
            </button>
        </div>
    );
};