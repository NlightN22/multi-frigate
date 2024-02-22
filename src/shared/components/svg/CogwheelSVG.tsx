import { DEFAULT_THEME } from '@mantine/core';
import React from 'react';

const CogwheelSVG = (
    <svg
        width="86"
        height="86"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke={DEFAULT_THEME.colors.blue[6]}
    >
        <path
            d="M43 55c6.628 0 12-5.372 12-12s-5.372-12-12-12-12 5.372-12 12 5.372 12 12 12z"
            stroke="#228BE6"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M73.49 36.582l-4.391-10.603L75 19l-8-8-6.941 5.932-10.828-4.453L46.741 3h-7.817l-2.528 9.604-10.578 4.46L19 11l-8 8 5.814 7.155-4.324 10.63L3 39v8l9.604 2.622 4.459 10.577L11 67l8 8 7.165-5.839 10.423 4.288L39 83h8l2.418-9.547 10.602-4.391C61.788 70.325 67 75 67 75l8-8-5.936-7.002 4.392-10.606L83 46.909V39l-9.51-2.418z"
            stroke="#228BE6"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 43 43"
                to="360 43 43"
                dur="3s"
                repeatCount="indefinite"
            />
        </path>
    </svg>
);

export default CogwheelSVG;