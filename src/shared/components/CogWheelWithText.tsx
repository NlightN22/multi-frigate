import { Center, Text } from '@mantine/core';
import React from 'react';

interface CogWheelWithTextProps {
    text: string
}

const CogWheelWithText = ({ text }: CogWheelWithTextProps) => {
    return (
        <Center pos='relative'>
            <svg
                width={284}
                height={269}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M246.427 113.72l-15.039-34.325L251.6 56.8l-27.4-25.9-23.774 19.204-37.084-14.416L154.814 5H128.04l-8.657 31.095L83.15 50.532 59.8 30.9 32.4 56.8l19.911 23.166-14.808 34.414L5 121.55v25.9l32.895 8.489 15.27 34.242L32.4 212.2l27.4 25.9 24.539-18.903 35.7 13.882L128.3 264h27.4l8.282-30.909 36.313-14.215c6.053 4.089 23.905 19.224 23.905 19.224l27.4-25.9-20.332-22.67 15.042-34.336 32.689-8.039.001-25.605-32.573-7.83z"
                    stroke="#C92A2A"
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <Text 
            pos='absolute'
            top='50%' 
            left='50%'
            sx = {{transform: 'translate(-50%, -50%)'}}
            fz='3rem' 
            fw={800}>{text}</Text>
        </Center>
    );
};

export default CogWheelWithText;