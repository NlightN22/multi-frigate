import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { routesPath } from '../../../router/routes.path';

interface ErrorFallbackProps {
    error: Error
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    error
}) => {

    const navigate = useNavigate()

    const handleResetErrorBoundary = () => {
        navigate(routesPath.MAIN_PATH)
    }

    return (
        <div role="alert">
            <h1>Something went wrong:</h1>
            <pre>{error.message}</pre>
            <button onClick={handleResetErrorBoundary}>Try again</button>
        </div>
    );
};

export default ErrorFallback;