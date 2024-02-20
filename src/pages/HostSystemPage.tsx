import React from 'react';
import { useParams } from 'react-router-dom';

const HostSystemPage = () => {
    let { id } = useParams<'id'>()

    return (
        <div>
            System Page - NOT YET IMPLEMENTED
        </div>
    );
};

export default HostSystemPage;