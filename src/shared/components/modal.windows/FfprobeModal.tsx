import { useQuery } from "@tanstack/react-query"
import { frigateQueryKeys, proxyApi } from "../../../services/frigate.proxy/frigate.api"
import CogwheelLoader from "../loaders/CogwheelLoader"
import RetryError from "../RetryError"
import { Button, Center, Text } from "@mantine/core"
import { ContextModalProps } from "@mantine/modals"

export interface FfprobeModalProps {
    hostName?: string
    cameraName: string
}

export const FfprobeModal = ({ context, id, innerProps }: ContextModalProps<FfprobeModalProps>) => {
    const { hostName, cameraName } = innerProps
    const { data, isError, isPending, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraFfprobe, hostName, cameraName],
        queryFn: () => {
            if (!hostName) return null
            return proxyApi.getCameraFfprobe(hostName, cameraName)
        }
    })

    if (isPending) return <CogwheelLoader />
    if (isError) return <RetryError onRetry={refetch} />
    if (!data || data.length < 1) return <Text>Data is empty</Text>

    const streamItems = data.map((res, streamIndex) => {
        if (res.return_code !== 0) {
            return (
                <div key={streamIndex}>
                    <Center><Text weight={700}>Stream: {streamIndex}</Text></Center>
                    <Text>{res.return_code}</Text>
                    <Text>{res.stderr}</Text>
                </div>
            )
        }
        const flows = res.stdout.streams.map((stream, flowIndex) => (
            <div key={streamIndex + flowIndex}>
                <Text>Codec: {stream.codec_long_name}</Text>
                {!stream.width && !stream.height ? null :
                    <Text>Resolution: {stream.width}x{stream.height} </Text>
                }
                <Text>FPS: {stream.avg_frame_rate}</Text>
            </div>
        ))
        return (
            <>
                <Center><Text weight={700}>Stream: {streamIndex}</Text></Center>
                {flows}
            </>
        )
    })

    return (
        <>
            {streamItems}
            <Center>
                <Button onClick={() => context.closeModal(id)}>Close</Button >
            </Center>
        </>
    )
}