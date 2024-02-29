import { Button, Loader, Progress, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconExternalLink } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { proxyApi } from '../services/frigate.proxy/frigate.api';
import RetryError from '../shared/components/RetryError';
import { formatFileTimestamps } from '../shared/utils/dateUtil';

interface VideoDownloaderProps {
    cameraName: string
    hostName: string
    startUnixTime: number
    endUnixTime: number
}

const VideoDownloader = ({
    cameraName,
    hostName,
    startUnixTime,
    endUnixTime,
}: VideoDownloaderProps) => {
    const maxVideoTime = 70 * 60
    const [createName, setCreateName] = useState<string>()
    const [link, setLink] = useState<string>()
    const [error, setError] = useState<boolean>()
    const [timer, setTimer] = useState<NodeJS.Timer>()
    const [videoBlob, setVideoBlob] = useState<Blob>()
    const [videoSrc, setVideoSrc] = useState<string>()
    const [progress, setProgress] = useState<number>()

    const createVideo = useMutation({
        mutationFn: () => {
            setError(false)
            return proxyApi.postExportVideoTask(hostName, cameraName, startUnixTime, endUnixTime)
        },
        onSuccess: () => {
            const fileName = formatFileTimestamps(startUnixTime, endUnixTime, cameraName)
            setCreateName(fileName)
        },
        onError: () => setError(true)
    })

    const checkVideo = useMutation({ mutationFn: () => proxyApi.getExportedVideoList(hostName) })

    const getVideBlob = useMutation({
        mutationKey: [link],
        mutationFn: (inlink: string) => {
            return proxyApi.getVideoFrigate(inlink, (progress) => {
                setProgress(progress)
            })
        },
        onSuccess: (data) => {
            setVideoBlob(data)
        },
    })

    const deleteVideo = useMutation({
        mutationFn: (videoName: string) => proxyApi.deleteExportedVideo(hostName, videoName),
        onSuccess: () => setLink(undefined)
    })

    useEffect(() => {
        if (createName && !link && !videoBlob) {
            const intervalId = setInterval(() => {
                checkVideo.mutate(undefined, {
                    onSuccess: (data) => {
                        const createdFile = data.find(file => file.name === createName);
                        if (createdFile && !link && !videoBlob) {
                            const link = proxyApi.getVideoUrl(hostName, createdFile.name)
                            setLink(link);
                            getVideBlob.mutateAsync(link)
                            clearInterval(intervalId)
                            setTimer(undefined)
                        }
                    }
                })
            }, 5 * 1000)

            if (intervalId) setTimer(intervalId)

            setTimeout(() => {
                clearInterval(timer)
                setTimer(undefined)
            }, 5 * 60 * 1000)
        }
    }, [createName, link, videoBlob, checkVideo, getVideBlob, hostName, timer])

    useEffect(() => {
        if (videoBlob && videoBlob instanceof Blob && createName) {
            if (link) deleteVideo.mutateAsync(createName)
            const objectURL = URL.createObjectURL(videoBlob);
            setVideoSrc(objectURL);
            return () => {
                if (objectURL) {
                    URL.revokeObjectURL(objectURL);
                }
            }
        }
    }, [videoBlob, createName, link, deleteVideo])

    const checkTime = () => {
        const duration = endUnixTime - startUnixTime
        if (duration > maxVideoTime) {
            notifications.show({
                id: 'too-much-time',
                withCloseButton: true,
                autoClose: 5000,
                title: "Max duration",
                message: `Time can not be higher than ${maxVideoTime / 60} hour`,
                color: 'red',
                icon: <IconAlertCircle />,
            })
            return false
        }
        return true
    }

    const handleDownload = () => {
        if (!checkTime()) return
        createVideo.mutate()

    }

    // TODO delete
    // const handleCancel = () => {
    //     clearTimeout(timer)
    //     setTimer(undefined)
    //     setCreateName(undefined)
    //     setLink(undefined)
    // }


    if (startUnixTime === 0 || endUnixTime === 0) return null
    if (error) return <RetryError onRetry={() => createVideo.mutate()} />
    if (link && progress && !videoSrc) return (
        <Progress w='100%' value={progress} size='xl' radius='xl' label={`${progress.toFixed(2)}%`} />
    )

    const getReadyDownload = (
        // link example http://my-proxy-server/hostname:4000/exports/HOME_1_Backyard_2024_02_26_16_25__2024_02_26_16_26.mp4
        <Button component="a" href={videoSrc} download variant="outline" leftIcon={<IconExternalLink size="0.9rem" />}>
            Ready! Download?
        </Button>
    )
    if (videoSrc) return getReadyDownload

    const preparingVideo = (
        <>
            <Text>Preparing video...<Loader /></Text>
        </>
    )
    if (createName) return preparingVideo

    return (
        <Button
            onClick={handleDownload}
        >
            Download
        </Button>
    );
};

export default VideoDownloader;