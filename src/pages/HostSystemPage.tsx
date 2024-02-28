import React, { useContext, useEffect, useRef } from 'react';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import Forbidden from './403';
import { observer } from 'mobx-react-lite';

const HostSystemPage = () => {
    const executed = useRef(false)
    const { sideBarsStore } = useContext(Context)
    const { isAdmin } = useAdminRole()

    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])

    if (!isAdmin) return <Forbidden />

    return (
        <div>
            System Page - NOT YET IMPLEMENTED
        </div>
    );
};

export default observer(HostSystemPage);