import { makeAutoObservable } from "mobx"
import { z } from "zod"
import { GetCameraWHostWConfig, GetFrigateHost } from "../../services/frigate.proxy/frigate.schema"

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

    private _playedURL: string | undefined
    public get playedItem(): string | undefined {
        return this._playedURL
    }
    public set playedItem(value: string | undefined) {
        this._playedURL = value
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

    private _filteredHost: GetFrigateHost | undefined
    public get filteredHost(): GetFrigateHost | undefined {
        return this._filteredHost
    }
    public set filteredHost(value: GetFrigateHost | undefined) {
        this._filteredHost = value
    }
    private _filteredCamera: GetCameraWHostWConfig | undefined
    public get filteredCamera(): GetCameraWHostWConfig | undefined {
        return this._filteredCamera
    }
    public set filteredCamera(value: GetCameraWHostWConfig | undefined) {
        this._filteredCamera = value
    }
    private _selectedRange: [Date | null, Date | null] = [null, null]
    public get selectedRange(): [Date | null, Date | null] {
        return this._selectedRange
    }
    public set selectedRange(value: [Date | null, Date | null]) {
        this._selectedRange = value
    }

    private _openedCamera: GetCameraWHostWConfig | undefined
    public get openedCamera(): GetCameraWHostWConfig | undefined {
        return this._openedCamera
    }
    public set openedCamera(value: GetCameraWHostWConfig | undefined) {
        this._openedCamera = value
    }
}