import { makeAutoObservable } from "mobx"
import { z } from "zod"
import { GetCameraWHostWConfig, GetFrigateHost, GetFrigateHostWithCameras } from "../../services/frigate.proxy/frigate.schema"

export type RecordForPlay = {
    hostName?: string // format 'localhost:4000'
    cameraName?: string
    hour?: string
    day?: string
    timezone?: string
}

export class RecordingsStore {
    constructor() {
        makeAutoObservable(this)
    }

    recordingSchema = z.object({
        hostName: z.string(),
        cameraName: z.string(),
        hour: z.string(),
        day: z.string(),
        timezone: z.string(),
    })

    private _recordToPlay: RecordForPlay = {}
    public get recordToPlay(): RecordForPlay {
        return this._recordToPlay
    }
    public set recordToPlay(value: RecordForPlay) {
        this._recordToPlay = value
    }
    getFullRecordForPlay(value: RecordForPlay) {
        return this.recordingSchema.safeParse(value)
    }

    private _hostIdParam: string | undefined
    public get hostIdParam(): string | undefined {
        return this._hostIdParam
    }
    public set hostIdParam(value: string | undefined) {
        this._hostIdParam = value
    }
    private _cameraIdParam: string | undefined
    public get cameraIdParam(): string | undefined {
        return this._cameraIdParam
    }
    public set cameraIdParam(value: string | undefined) {
        this._cameraIdParam = value
    }

    private _selectedHost: GetFrigateHost | undefined
    public get selectedHost(): GetFrigateHost | undefined {
        return this._selectedHost
    }
    public set selectedHost(value: GetFrigateHost | undefined) {
        this._selectedHost = value
    }
    private _selectedCamera: GetCameraWHostWConfig | undefined
    public get selectedCamera(): GetCameraWHostWConfig | undefined {
        return this._selectedCamera
    }
    public set selectedCamera(value: GetCameraWHostWConfig | undefined) {
        this._selectedCamera = value
    }
    selectedStartDay: string = ''
    selectedEndDay: string = ''
}