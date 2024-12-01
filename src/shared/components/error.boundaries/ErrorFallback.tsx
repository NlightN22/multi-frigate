import React from 'react';
import { FallbackProps } from 'react-error-boundary';


const ErrorFallback: React.FC<FallbackProps> = ({
    error,
    resetErrorBoundary
}) => {


    const handleResetErrorBoundary = () => {
        resetErrorBoundary()
        window.location.reload()
    }

    return (
        <div
            role="alert"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '98vh', 
                margin: 0,
                overflow: 'hidden',
                textAlign: 'center',
                backgroundColor: '#f8f9fa', 
                color: '#212529',
                padding: 0,
            }}
        >
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
            <pre style={{ marginBottom: '1rem', color: '#d9534f' }}>{error.message}</pre>
            <button
                onClick={handleResetErrorBoundary}
                style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Reload Page
            </button>
        </div>
    );
};

export default ErrorFallback;