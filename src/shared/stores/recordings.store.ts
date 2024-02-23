import { z } from "zod"

export type RecordingPlay = {
    hostName?: string
    cameraName?: string
    hour?: string
    day?: string
    timezone?: string
}



export class RecordingsStore {
    recordingSchema = z.object({
        hostName: z.string(),
        cameraName: z.string(),
        hour: z.string(),
        day: z.string(),
        timezone: z.string(),
    })

    private _playedRecord: RecordingPlay = {}
    public get playedRecord(): RecordingPlay {
        return this._playedRecord
    }
    public set playedRecord(value: RecordingPlay) {
        this._playedRecord = value
    }

    getFullPlayedRecord(value: RecordingPlay) {
        return this.recordingSchema.safeParse(value)
    }
}