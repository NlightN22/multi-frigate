import React from 'react';
import { useParams } from 'react-router-dom';

const HostStoragePage = () => {
    let { id } = useParams<'id'>()

    return (
        <div>
            Storage Page - NOT YET IMPLEMENTED
        </div>
    );
};

export default HostStoragePage;