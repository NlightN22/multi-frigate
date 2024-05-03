import { makeAutoObservable } from "mobx";

export class MainStore {

    private _selectedHostId: string | undefined
    public get selectedHostId(): string | undefined {
        return this._selectedHostId;
    }
    public set selectedHostId(value: string | undefined) {
        this._selectedHostId = value;
    }

    constructor() {
        makeAutoObservable(this)
    }
}