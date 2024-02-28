import { Flex } from '@mantine/core';
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayer from '../shared/components/players/VideoPlayer';
import { proxyURL } from '../shared/env.const';
import { proxyApi } from '../services/frigate.proxy/frigate.api';
import NotFound from './404';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

export const playRecordPageQuery = {
    link: 'link',
    // hostName: 'hostName',
}

const PlayRecordPage = () => {
    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        sideBarsStore.rightVisible = false
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
    }, [])

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const paramLink = queryParams.get(playRecordPageQuery.link)
    // const paramHostName = queryParams.get(playRecordPageQuery.hostName);

    if (!paramLink) return (<NotFound />)
    return (
        <Flex w='100%' h='100%' justify='center' align='center' direction='column'>
            <VideoPlayer videoUrl={paramLink} />
        </Flex>
    );
};

export default observer(PlayRecordPage);