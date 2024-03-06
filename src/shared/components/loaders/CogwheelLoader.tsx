import { Center } from '@mantine/core';
import CogwheelSVG from '../svg/CogwheelSVG';
import { useState, useEffect } from 'react';

interface CogwheelLoaderProps {
    duration?: number;
    onTimeout?: () => void;
}

const CogwheelLoader: React.FC<CogwheelLoaderProps> = ({
    duration,
    onTimeout,
}) => {
    const [isTimeout, setIsTimeout] = useState(false)

    useEffect(() => {
        if (duration && onTimeout) {
            const timer = setTimeout(() => {
                setIsTimeout(true);
                onTimeout();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onTimeout])

    return (
        <Center>
            {CogwheelSVG}
        </Center>
    );
};

export default CogwheelLoader;