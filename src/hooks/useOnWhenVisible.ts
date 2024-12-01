import { useState, useEffect } from "react";

const hasIntersectionObserver: boolean =
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "isIntersecting" in window.IntersectionObserverEntry.prototype;

interface UseOnWhenVisibleOptions {
    alwaysVisible?: boolean;
    threshold?: number | number[];
}

export function useOnWhenVisible({
    alwaysVisible = false,
    threshold = 0.1,
}: UseOnWhenVisibleOptions): [React.RefCallback<HTMLDivElement>, boolean] {
    const [ref, setRef] = useState<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(
        alwaysVisible || !hasIntersectionObserver
    );

    if (!hasIntersectionObserver) {
        console.warn("IntersectionObserver is not supported in this browser.");
    }

    useEffect(() => {
        if (ref == null || isVisible || !hasIntersectionObserver) {
            return undefined;
        }


        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        }, { threshold });

        observer.observe(ref);
        const rect = ref.getBoundingClientRect();
        const isCurrentlyVisible =
            rect.top < window.innerHeight && rect.bottom > 0;
        if (isCurrentlyVisible) {
            setIsVisible(true);
        }

        return () => {
            observer.disconnect();
        };
    }, [ref, isVisible, threshold]);

    return [setRef, isVisible];
}
