import { z } from 'zod'

export const NumberFilterSchema = z.object({
    id: z.string(),
    name: z.string(),
    defualtValue: z.union([
        z.number().optional(),
        z.tuple([z.number(), z.number()]).optional()
    ]),
    min: z.number(),
    max: z.number(),
    range: z.boolean(),
    defaultVisible: z.boolean().optional(),
    priority: z.number().optional(),
    // UI controlled
    visible: z.boolean().optional(),
    alwaysVisible: z.boolean().optional(),
})

export type NumberFilter = z.infer<typeof NumberFilterSchema>

export const SelectValueSchema = z.object({
    valueId: z.string(),
    valueName: z.string(),
})

export const SelectFilterSchema = z.object({
    id: z.string(),
    name: z.string(),
    defualtValueId: z.string().optional(),
    multi: z.boolean(),
    values: z.array(SelectValueSchema),
    defaultVisible: z.boolean().optional(),
    priority: z.number().optional(),
    // UI controlled
    visible: z.boolean().optional(),
    alwaysVisible: z.boolean().optional(),
})

export type SelectFilter = z.infer<typeof SelectFilterSchema>

export const SwitchFilterSchema = z.object({
    id: z.string(),
    name: z.string(),
    defualtValue: z.boolean().optional(),
    defaultVisible: z.boolean().optional(),
    priority: z.number().optional(),
    // UI controlled
    visible: z.boolean().optional(),
    alwaysVisible: z.boolean().optional(),
})

export type SwitchStore = z.infer<typeof SwitchFilterSchema>

export type ServerFilter = (SwitchStore | NumberFilter | SelectFilter)