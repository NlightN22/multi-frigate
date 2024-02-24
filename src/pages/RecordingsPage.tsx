
import { useState, useContext, useEffect, lazy, Suspense } from 'react';
import { Accordion, Flex, Text } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import RecordingsFiltersRightSide from '../widgets/RecordingsFiltersRightSide';
import SelectedCameraList from '../widgets/SelectedCameraList';
import SelectedHostList from '../widgets/SelectedHostList';
import { useQuery } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';


const recordingsQuery = {
  hostId: 'hostId',
  cameraId: 'cameraId',
  date: 'date',
  hour: 'hour',
}

const RecordingsPage = observer(() => {
  const { sideBarsStore, recordingsStore: recStore } = useContext(Context)

  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const paramHostId = queryParams.get(recordingsQuery.hostId)
  const paramCameraId = queryParams.get(recordingsQuery.cameraId);
  const paramDate = queryParams.get(recordingsQuery.date);
  const paramTime = queryParams.get(recordingsQuery.hour);

  const [hostId, setHostId] = useState<string>('')
  const [cameraId, setCameraId] = useState<string>('')

  useEffect(() => {
    sideBarsStore.rightVisible = true
    sideBarsStore.setRightChildren(
      <RecordingsFiltersRightSide />
    )
    if (paramHostId) recStore.hostIdParam = paramHostId
    if (paramCameraId) recStore.cameraIdParam = paramCameraId
    return () => sideBarsStore.setRightChildren(null)
  }, [])

  useEffect(() => {
    setHostId(recStore.selectedHost?.id || '')
    if (recStore.selectedHost) {
      queryParams.set(recordingsQuery.hostId, recStore.selectedHost.id)
    } else {
      queryParams.delete(recordingsQuery.hostId)
    }
    navigate({ pathname: location.pathname, search: queryParams.toString() });
  }, [recStore.selectedHost])

  useEffect(() => {
    setCameraId(recStore.selectedCamera?.id || '')
    if (recStore.selectedCamera) {
      queryParams.set(recordingsQuery.cameraId, recStore.selectedCamera?.id)
    } else {
      console.log('delete recordingsQuery.cameraId')
      queryParams.delete(recordingsQuery.cameraId)
    }
    navigate({ pathname: location.pathname, search: queryParams.toString() });
  }, [recStore.selectedCamera])

  if (cameraId) {
    return <SelectedCameraList cameraId={cameraId} />
  }

  if (hostId) {
    return <SelectedHostList hostId={hostId} />
  }

  console.log('RecordingsPage rendered')
  return (
    <Flex w='100%' h='100%' direction='column' justify='center' align='center'>
      <Text size='xl'>Please select host</Text>
    </Flex>
  )
})

export default RecordingsPage