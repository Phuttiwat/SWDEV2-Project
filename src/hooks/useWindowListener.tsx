import { useEffect } from 'react';

export function useWindowListener(eventType: string, handler: (event: Event) => void) {
    useEffect(() => {
        const handleEvent = (event: Event) => {
            handler(event);
        };

        window.addEventListener(eventType, handleEvent);

        return () => {
            window.removeEventListener(eventType, handleEvent);
        };
    }, [eventType, handler]);
}