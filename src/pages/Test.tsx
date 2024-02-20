import React, { Fragment, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import JSMpegPlayer from '../shared/components/frigate/JSMpegPlayer';
import { frigateApi } from '../services/frigate.proxy/frigate.api';
import { Flex } from '@mantine/core';
import AutoUpdatingCameraImage from '../shared/components/frigate/AutoUpdatingCameraImage';

const Test = observer(() => {
  // const test = {
  //   camera: 'Buhgalteria',
  //   host: 'localhost:5000',
  //   width: 800,
  //   height: 600,
  //   url : function() {  return frigateApi.cameraWsURL(this.host, this.camera)},
  // }

  // return (
  //   <Flex w='100%' h='100%'>
  //       <JSMpegPlayer wsUrl={test.url()} camera={test.camera} width={test.width} height={test.height} />
  //   </Flex>
  // );

  return (
    <Flex w='100%' h='100%'>

    </Flex>
  );
})

export default Test;