import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../..';
import { frigateApi, frigateQueryKeys } from '../../../services/frigate.proxy/frigate.api';
import { isProduction } from '../../env.const';
import CameraSelect from './CameraSelect';

interface CameraSelectFilterProps {
    selectedHostId: string,
}

const CameraSelectFilter = ({
    selectedHostId,
}: CameraSelectFilterProps) => {
    const { t } = useTranslation()
    const { recordingsStore: recStore } = useContext(Context)

    const { data } = useQuery({
        queryKey: [frigateQueryKeys.getCameraByHostId, selectedHostId],
        queryFn: () => frigateApi.getCamerasByHostId(selectedHostId)
    })

    const handleSuccess = () => {
        if (!data) return
        if (recStore.cameraIdParam) {
            if (!isProduction) console.log('change camera by param')
            recStore.filteredCamera = data.find(camera => camera.id === recStore.cameraIdParam)
            recStore.cameraIdParam = undefined
        }
    }

    const handleSelect = (value: string) => {
        const camera = data?.find(camera => camera.id === value)
        if (!camera) {
            recStore.filteredCamera = undefined
            return
        }
        recStore.filteredCamera = camera
    }

    if (!isProduction) console.log('CameraSelectFilter rendered')

    return (

        < CameraSelect
            hostId={selectedHostId}
            label={t('selectCamera')}
            spaceBetween='1rem'
            valueId={recStore.filteredCamera?.id || ''}
            defaultId={recStore.filteredCamera?.id || ''}
            onChange={handleSelect}
            onSuccess={handleSuccess}
        />
    );
};

export default observer(CameraSelectFilter);