
import { useState, useContext, useEffect } from 'react';
import {  Flex, Text } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import RecordingsFiltersRightSide from '../widgets/RecordingsFiltersRightSide';
import SelectedCameraList from '../widgets/SelectedCameraList';
import SelectedHostList from '../widgets/SelectedHostList';
import { dateToQueryString, parseQueryDateToDate } from '../shared/utils/dateUtil';
import SelectedDayList from '../widgets/SelectedDayList';
import CenterLoader from '../shared/components/loaders/CenterLoader';


export const recordingsPageQuery = {
  hostId: 'hostId',
  cameraId: 'cameraId',
  startDay: 'startDay',
  endDay: 'endDay',
  hour: 'hour',
}

const RecordingsPage = observer(() => {
  const { sideBarsStore, recordingsStore: recStore } = useContext(Context)

  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const paramHostId = queryParams.get(recordingsPageQuery.hostId)
  const paramCameraId = queryParams.get(recordingsPageQuery.cameraId);
  const paramStartDay = queryParams.get(recordingsPageQuery.startDay);
  const paramEndDay = queryParams.get(recordingsPageQuery.endDay);
  const paramTime = queryParams.get(recordingsPageQuery.hour);

  const [hostId, setHostId] = useState<string>('')
  const [cameraId, setCameraId] = useState<string>('')
  const [period, setPeriod] = useState<[Date | null, Date | null]>([null, null])
  const [firstRender, setFirstRender] = useState(false)

  useEffect(() => {
    sideBarsStore.rightVisible = true
    sideBarsStore.setRightChildren(
      <RecordingsFiltersRightSide />
    )
    if (paramHostId) recStore.hostIdParam = paramHostId
    if (paramCameraId) recStore.cameraIdParam = paramCameraId
    if (paramStartDay && paramEndDay) {
      const parsedStartDay = parseQueryDateToDate(paramStartDay)
      const parsedEndDay = parseQueryDateToDate(paramEndDay)
      recStore.selectedRange = [parsedStartDay, parsedEndDay]
    }
    setFirstRender(true)
    return () => {
      sideBarsStore.setRightChildren(null)
      sideBarsStore.rightVisible = false
    }
  }, [])

  useEffect(() => {
    setHostId(recStore.filteredHost?.id || '')
    if (recStore.filteredHost) {
      queryParams.set(recordingsPageQuery.hostId, recStore.filteredHost.id)
    } else {
      queryParams.delete(recordingsPageQuery.hostId)
    }
    navigate({ pathname: location.pathname, search: queryParams.toString() });
  }, [recStore.filteredHost])

  useEffect(() => {
    setCameraId(recStore.filteredCamera?.id || '')
    if (recStore.filteredCamera) {
      queryParams.set(recordingsPageQuery.cameraId, recStore.filteredCamera?.id)
    } else {
      queryParams.delete(recordingsPageQuery.cameraId)
    }
    navigate({ pathname: location.pathname, search: queryParams.toString() });
  }, [recStore.filteredCamera])

  useEffect(() => {
    setPeriod(recStore.selectedRange)
    const [startDay, endDay] = recStore.selectedRange
    if (startDay && endDay) {
      const startQuery = dateToQueryString(startDay)
      const endQuery = dateToQueryString(endDay)
      queryParams.set(recordingsPageQuery.startDay, startQuery)
      queryParams.set(recordingsPageQuery.endDay, endQuery)
    } else {
      queryParams.delete(recordingsPageQuery.startDay)
      queryParams.delete(recordingsPageQuery.endDay)
    }
    navigate({ pathname: location.pathname, search: queryParams.toString() });
  }, [recStore.selectedRange])

  console.log('RecordingsPage rendered')

  if (!firstRender) return <CenterLoader />

  const [startDay, endDay] = period
  if (startDay && endDay) {
    if (startDay.getDate() === endDay.getDate()) { // if select only one day
      return <SelectedDayList day={startDay} />
    }
  }

  if (cameraId && paramCameraId) {
    if ((startDay && endDay) || (!startDay && !endDay)) {
      return <SelectedCameraList />
    }
  }

  if (hostId && paramHostId && !cameraId) {
    return <SelectedHostList hostId={hostId} />
  }

  return (
    <Flex w='100%' h='100%' direction='column' justify='center' align='center'>
      {!hostId ?
        <Text size='xl'>Please select host</Text>
        : <></>}
      {hostId && !(startDay && endDay) ?
        <Text size='xl'>Please select date</Text>
        : <></>
      }
    </Flex>
  )
})

export default RecordingsPage