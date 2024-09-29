import { SelectItem } from "@mantine/core";
import { z } from "zod";

export const putUserTag = z.object({
    value: z.string(),
    cameraIds: z.string().array()
})

export const getUserTag = z.object({
    id: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    value: z.string(),
    userId: z.string(),
    cameraIds: z.string().array(),
})

export type GetUserTag = z.infer<typeof getUserTag>
export type PutUserTag = z.infer<typeof putUserTag>

export const mapUserTagsToSelectItems = (tags: GetUserTag[]): SelectItem[] => {
    return tags.map(tag => ({
        value: tag.id,
        label: tag.value
    }))
}