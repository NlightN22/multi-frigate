import React, { useMemo } from 'react'
import { CameraConfig } from '../../../types/frigateConfig'
import { Point } from '../../utils/maskPoint'
import { OneSelectItem } from './OneSelectFilter'
import { Flex, Select, Button, MantineStyleSystemProps } from '@mantine/core'

interface MaskSelectProps extends MantineStyleSystemProps {
    cameraConfig: CameraConfig
    onSelect: (mask?: MaskItem) => void
}

export interface MaskItem {
    id: string
    type: MaskType
    coordinates: Point[]
}

export enum MaskType {
    Motion = 'motion',
    Zone = 'zone',
    Object = 'object',
}

const createMaskSelectItems = (data: MaskItem[], groupLabel: string): OneSelectItem[] => {
    return data.map(({ id, coordinates }, index) => ({
        value: id,
        label: `${id} ${Point.arrayToString(coordinates)}`,
        group: `${groupLabel} masks`,
    }))
}

const MaskSelect: React.FC<MaskSelectProps> = ({
    cameraConfig,
    onSelect,
    ...styleProps
}) => {

    const { motions, zones, objects, items } = useMemo(() => {
        const motions: MaskItem[] = cameraConfig.motion.mask.map((mask, index) => ({
            id: `motion_${index}`,
            type: MaskType.Motion,
            coordinates: Point.parseCoordinates(mask),
        }))
        motions.push({
            id: `add_new_motion_${motions.length}`,
            type: MaskType.Motion,
            coordinates: []
        })

        const zones: MaskItem[] = Object.entries(cameraConfig.zones).map(([name, params], index) => ({
            id: `${name}_${index}`,
            type: MaskType.Zone,
            coordinates: Point.parseCoordinates(params.coordinates),
        }))
        zones.push({
            id: `add_new_zone_${zones.length}`,
            type: MaskType.Zone,
            coordinates: []
        })

        const objects: MaskItem[] = Object.entries(cameraConfig.objects.filters)
            .filter(([name, params]) => params.mask !== null)
            .map(([name, params], index) => ({
                id: `${name}_${index}`,
                type: MaskType.Object,
                coordinates: Point.parseCoordinates(params.mask!),
            }))
        objects.push({
            id: `add_new_object_${objects.length}`,
            type: MaskType.Object,
            coordinates: []
        })

        const motionItems: OneSelectItem[] = createMaskSelectItems(motions, 'Motion')
        const zonesItems: OneSelectItem[] = createMaskSelectItems(zones, 'Zone')
        const objectsItems: OneSelectItem[] = createMaskSelectItems(objects, 'Object')

        return {
            motions,
            zones,
            objects,
            items: [...motionItems, ...zonesItems, ...objectsItems],
        }
    }, [cameraConfig])

    const handleSelect = (id: string) => {
        const mask = [...motions, ...zones, ...objects].find(item => item.id === id)
        onSelect(mask)
    }

    return (
        <Select
            placeholder='Select Mask'
            data={items}
            onChange={handleSelect}
            {...styleProps}
        />
    )
}

export default MaskSelect