import { Flex } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import VideoPlayer from '../shared/components/players/VideoPlayer';
import NotFound from './404';

export const playRecordPageQuery = {
    link: 'link',
}

const PlayRecordPage = () => {

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