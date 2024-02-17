import React, { Fragment, useContext, useEffect } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import JSMpegPlayer from '../shared/components/JSMpegPlayer';
import { cameraLiveViewURL } from '../router/frigate.routes';

const Test = observer(() => {
  // const { postStore } = useContext(Context)
  // const { getPostsAction, posts } = postStore

  // useEffect( () => {
  //     console.log("render Test")
  //     getPostsAction()
  // }, [])


  const test = {
    camera: 'Buhgalteria',
    host: 'localhost:5000',
    width: 800,
    height: 600,
    url : function() { return cameraLiveViewURL(this.host, this.camera)},
  }
  const test2 = {
    camera: 'IT',
    host: 'localhost:5000',
    width: 800,
    height: 600,
    url : function() { return cameraLiveViewURL(this.host, this.camera)},
  }
  const test3 = {
    camera: 'Magazin1',
    host: 'localhost:5001',
    width: 800,
    height: 600,
    url : function() { return cameraLiveViewURL(this.host, this.camera)},
  }


  // console.log(posts)
  return (
    <Fragment>
      <div>
        <JSMpegPlayer url={test.url()} camera={test.camera} width={test.width} height={test.height} />
        <JSMpegPlayer url={test2.url()} camera={test2.camera} width={test2.width} height={test2.height} />
        <JSMpegPlayer url={test3.url()} camera={test3.camera} width={test3.width} height={test3.height} />
      </div>
    </Fragment>
  );
})

export default Test;