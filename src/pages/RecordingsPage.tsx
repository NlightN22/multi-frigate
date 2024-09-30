
import { Flex, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { isProduction } from '../shared/env.const';
import { dateToQueryString, parseQueryDateToDate } from '../shared/utils/dateUtil';
import RecordingsFiltersRightSide from '../widgets/sidebars/RecordingsFiltersRightSide';
import SelectedCameraList from '../widgets/SelectedCameraList';
import SelectedDayList from '../widgets/SelectedDayList';
import SelectedHostList from '../widgets/SelectedHostList';
import { useTranslation } from 'react-i18next';
import { SideBarContext } from '../widgets/sidebars/SideBarContext';

export const recordingsPageQuery = {
  hostId: 'hostId',
  cameraId: 'cameraId',
  startDay: 'startDay',
  endDay: 'endDay',
  hour: 'hour',
}

const RecordingsPage = () => {
  const { t } = useTranslation()
  const executed = useRef(false)
  const { recordingsStore: recStore } = useContext(Context)

  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search])
  const paramHostId = queryParams.get(recordingsPageQuery.hostId)
  const paramCameraId = queryParams.get(recordingsPageQuery.cameraId);
  const paramStartDay = queryParams.get(recordingsPageQuery.startDay);
  const paramEndDay = queryParams.get(recordingsPageQuery.endDay);

  const [hostId, setHostId] = useState<string>('')
  const [cameraId, setCameraId] = useState<string>('')
  const [period, setPeriod] = useState<[Date | null, Date | null]>([null, null])

  const { setRightChildren } = useContext(SideBarContext)

  useEffect(() => {
    setRightChildren(<RecordingsFiltersRightSide />);
    return () => setRightChildren(null);
  }, []);


  useEffect(() => {
    if (!executed.current) {
      if (paramHostId) recStore.hostIdParam = paramHostId
      if (paramCameraId) recStore.cameraIdParam = paramCameraId
      if (paramStartDay && paramEndDay) {
        const parsedStartDay = parseQueryDateToDate(paramStartDay)
        const parsedEndDay = parseQueryDateToDate(paramEndDay)
        recStore.selectedRange = [parsedStartDay, parsedEndDay]
      }
      executed.current = true
      if (!isProduction) console.log('RecordingsPage rendered first time')
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
  }, [recStore.filteredHost, location.pathname, navigate, queryParams])

  useEffect(() => {
    setCameraId(recStore.filteredCamera?.id || '')
    if (recStore.filteredCamera) {
      queryParams.set(recordingsPageQuery.cameraId, recStore.filteredCamera?.id)
    } else {
      queryParams.delete(recordingsPageQuery.cameraId)
    }
    navigate({ pathname: location.pathname, search: queryParams.toString() });
  }, [recStore.filteredCamera, location.pathname, navigate, queryParams])

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
  }, [recStore.selectedRange, location.pathname, navigate, queryParams])


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

  if (!isProduction) console.log('RecordingsPage rendered')

  return (
    <Flex w='100%' h='100%' direction='column' justify='center' align='center'>
      {!hostId ?
        <Text size='xl'>{t('pleaseSelectHost')}</Text>
        : <></>}
      {hostId && !(startDay && endDay) ?
        <Text size='xl'>{t('pleaseSelectDate')}</Text>
        : <></>
      }
    </Flex>
  )
}

export default observer(RecordingsPage)