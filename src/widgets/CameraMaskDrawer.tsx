import { Button, Center, Flex, Text } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Konva from 'konva'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Circle, Image, Layer, Line, Stage } from 'react-konva'
import { proxyApi } from '../services/frigate.proxy/frigate.api'
import RetryError from '../shared/components/RetryError'
import CogwheelLoader from '../shared/components/loaders/CogwheelLoader'
import { Point } from '../shared/utils/maskPoint'

interface CameraMaskDrawerProps {
  cameraWidth: number
  cameraHeight: number
  imageUrl: string
  inPoints: Point[]
  onChange: (points: Point[]) => void
}

const CameraMaskDrawer: React.FC<CameraMaskDrawerProps> = ({
  cameraWidth,
  cameraHeight,
  imageUrl,
  inPoints,
  onChange
}) => {

  const { height, width } = useViewportSize()
  const scaleStep = 0.1
  const [stageScale, setStageScale] = useState<number>(1)

  const [imageSrc, setImageSrc] = useState<HTMLImageElement | null>(null)

  const { data: imageBlob, refetch, isPending, isError } = useQuery({
    queryKey: [imageUrl],
    queryFn: () => proxyApi.getImageFrigate(imageUrl),
  });

  const [points, setPoints] = useState<Point[]>(inPoints)

  useEffect(() => {
    setPoints(inPoints)
  }, [inPoints])

  useEffect(() => {
    onChange(points)
  }, [points])

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target instanceof Konva.Circle) {
      return
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (point) {
      const x = point.x / stageScale
      const y = point.y / stageScale
      const normX = x > cameraWidth ? cameraWidth : x < 0 ? 0 : x
      const normY = y > cameraHeight ? cameraHeight : y < 0 ? 0 : y
      const newPoint = {
        x: Math.round(normX),
        y: Math.round(normY),
        id: `point_${points.length}`,
      }
      setPoints([...points, newPoint])
    }
  }

  const handlePointClick = (id: string) => {
    setPoints(points.filter(point => point.id !== id))
  }

  const setFitScale = () => {
    const scale = parseFloat(((width * 0.90) / cameraWidth).toFixed(2))
    setStageScale(scale)
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    const updatedPoints = points.map(point => {
      if (point.id === id) {
        const x = e.target.x()
        const y = e.target.y()
        const normX = x > cameraWidth ? cameraWidth : x < 0 ? 0 : x
        const normY = y > cameraHeight ? cameraHeight : y < 0 ? 0 : y
        return {
          ...point,
          x: Math.round(normX),
          y: Math.round(normY),
        };
      }
      return point;
    });
    setPoints(updatedPoints);
  };

  const handlePlusScale = () => setStageScale(stageScale + scaleStep)
  const handleMinusScale = () => setStageScale(stageScale - scaleStep)
  const handleResetScale = () => setStageScale(1)

  useEffect(() => {
    if (imageBlob && imageBlob instanceof Blob) {
      const objectURL = URL.createObjectURL(imageBlob);
      const img = new window.Image();
      img.src = objectURL;
      img.onload = () => {
        setImageSrc(img);
        return () => {
          URL.revokeObjectURL(objectURL);
        }
      };
    }
  }, [imageBlob])

  if (isPending || !imageSrc) return <CogwheelLoader />
  if (isError) return <RetryError onRetry={refetch} />

  if (!imageUrl) return <Center>Image url does not exist</Center>

  return (
    <Flex direction='column' w='100%' h='100%'>
      <Flex justify='center' align='center' mb='1rem'>
        <Text mr='1rem'>{(stageScale * 100).toFixed(0)}%</Text>
        <Button size='xs' variant='outline' mr='0.5rem' onClick={handlePlusScale}><IconPlus size='1.2rem' /></Button>
        <Button size='xs' variant='outline' mr='0.5rem' onClick={handleMinusScale}><IconMinus size='1.2rem' /></Button>
        <Button size='xs' variant='outline' mr='0.5rem' onClick={handleResetScale}>100%</Button>
        <Button size='xs' variant='outline' mr='0.5rem' onClick={setFitScale}>Fit</Button>
      </Flex>
      <Flex>
        <Stage
          width={cameraWidth * stageScale}
          height={cameraHeight * stageScale}
          scaleX={stageScale}
          scaleY={stageScale}
          onMouseDown={handleMouseDown}
        >
          <Layer>
            <Image
              image={imageSrc}
              width={cameraWidth}
              height={cameraHeight}
            />
            <Line
              points={points.flatMap(point => [point.x, point.y])}
              fill="rgba(0, 0, 255, 0.5)"
              closed={points.length > 2}
              stroke="black"
            />
            {points.map((point, index) => (
              <Circle
                key={point.id}
                x={point.x}
                y={point.y}
                radius={8 / stageScale}
                fill="red"
                draggable
                onDragEnd={(e) => handleDragEnd(e, point.id)}
                onClick={() => handlePointClick(point.id)}
                onTap={() => handlePointClick(point.id)}
              />
            ))}
          </Layer>
        </Stage>
      </Flex>
    </Flex>
  )
}

export default CameraMaskDrawer