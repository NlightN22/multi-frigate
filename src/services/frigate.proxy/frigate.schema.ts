import { z } from "zod";
import { CameraConfig, FrigateConfig } from "../../types/frigateConfig";

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
    state: z.boolean().nullable().optional()
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

export const getRoleSchema = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})

const getCameraWithHostSchema = getCameraSchema.merge(z.object({
    frigateHost: getFrigateHostSchema.optional(),
    roles: getRoleSchema.array().optional(),
}))

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

export const getEventsQuerySchema = z.object({
    hostName: z.string(),
    camerasName: z.string().array(),
    timezone: z.string().optional(),
    hasClip: z.boolean().optional(),
    after: z.number().optional(),
    before: z.number().optional(),
    labels: z.string().array().optional(),
    limit: z.number().optional(),
    includeThumnails: z.boolean().optional(),
    minScore: z.number().optional(),
    maxScore: z.number().optional(),
})



export const getRoleWCamerasSchema = getRoleSchema.merge(z.object({
    cameras: getCameraSchema.array()
}))


export const getUserByRoleSchema = z.object({
    id: z.string(),
    username: z.string(),
    enabled: z.boolean(),
    emailVerified: z.boolean(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
})

export const getExpotedFile = z.object({
    name: z.string(),
    type: z.string(),
    mtime: z.string(),
    size: z.number(),
})

export type GetConfig = z.infer<typeof getConfigSchema>
export type PutConfig = z.infer<typeof putConfigSchema>
export type GetFrigateHost = z.infer<typeof getFrigateHostSchema>
// export type GetFrigateHostWithCameras = z.infer<typeof getFrigateHostWithCamerasSchema>
export type GetFrigateHostWConfig = GetFrigateHost & { config: FrigateConfig }
export type GetCameraWHost = z.infer<typeof getCameraWithHostSchema>
export type GetCameraWHostWConfig = GetCameraWHost & { config?: CameraConfig }
export type PutFrigateHost = z.infer<typeof putFrigateHostSchema>
export type DeleteFrigateHost = z.infer<typeof deleteFrigateHostSchema>
export type GetRole = z.infer<typeof getRoleSchema>
export type GetRoleWCameras = z.infer<typeof getRoleWCamerasSchema>
export type GetUserByRole = z.infer<typeof getUserByRoleSchema>
export type GetExportedFile = z.infer<typeof getExpotedFile>