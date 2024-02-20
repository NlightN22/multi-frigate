import { any, z } from "zod";
import { FrigateConfig } from "../../types/frigateConfig";

export const putConfigSchema = z.object({
    key: z.string(),
    value: z.string(),
})

export const getConfigSchema = z.object({
    key: z.string(),
    value: z.string(),
    description: z.string(),
    encrypted: z.boolean(),
})

export const getFrigateHostSchema = z.object({
    id: z.string(),
    createAt: z.string(),
    updateAt: z.string(),
    name: z.string(),
    host: z.string(),
    enabled: z.boolean(),
});

export const getFrigateHostWConfigSchema = z.object({
    id: z.string(),
    createAt: z.string(),
    updateAt: z.string(),
    name: z.string(),
    host: z.string(),
    enabled: z.boolean(),
    config: z.any(),
});

const getCameraSchema = z.object({
    id: z.string(),
    createAt: z.string(),
    updateAt: z.string(),
    name: z.string(),
    url: z.string(),
    state: z.boolean().nullable(),
});

export const getFrigateHostWithCamerasSchema = getFrigateHostSchema.merge(z.object({
    cameras: z.array(getCameraSchema),
}))

export const putFrigateHostSchema = getFrigateHostSchema.omit({
    createAt: true,
    updateAt: true,
});

export const deleteFrigateHostSchema = putFrigateHostSchema.pick({
    id: true,
});

export type GetConfig = z.infer<typeof getConfigSchema>
export type PutConfig = z.infer<typeof putConfigSchema>
export type GetFrigateHost = z.infer<typeof getFrigateHostSchema>
export type GetFrigateHostWithCameras = z.infer<typeof getFrigateHostWithCamerasSchema>
export type GetFrigateHostWConfig = GetFrigateHost & { config: FrigateConfig}
export type PutFrigateHost = z.infer<typeof putFrigateHostSchema>
export type DeleteFrigateHost = z.infer<typeof deleteFrigateHostSchema>