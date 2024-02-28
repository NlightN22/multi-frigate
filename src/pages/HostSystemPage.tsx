import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import Forbidden from './403';
import { observer } from 'mobx-react-lite';

const HostSystemPage = () => {
    let { id } = useParams<'id'>()
    const { sideBarsStore } = useContext(Context)
    const { isAdmin, isLoading: adminLoading } = useAdminRole()

    useEffect(() => {
        sideBarsStore.rightVisible = false
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
    }, [])

    if (!isAdmin) return <Forbidden />

    return (
        <div>
            System Page - NOT YET IMPLEMENTED
        </div>
    );
};

export default observer(HostSystemPage);