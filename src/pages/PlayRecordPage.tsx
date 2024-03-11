import { Flex } from '@mantine/core';
import React, { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayer from '../shared/components/players/VideoPlayer';
import NotFound from './404';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

export const playRecordPageQuery = {
    link: 'link',
}

const PlayRecordPage = () => {
    const executed = useRef(false)
    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const paramLink = queryParams.get(playRecordPageQuery.link)

    if (!paramLink) return (<NotFound />)
    return (
        <Flex w='100%' h='100%' justify='center' align='center' direction='column'>
            <VideoPlayer videoUrl={paramLink} />
        </Flex>
    );
};

export default observer(PlayRecordPage);