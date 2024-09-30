import { makeAutoObservable } from "mobx";
import { CameraTag } from "../../types/tags";

export class MainStore {

    private _selectedHostId: string | undefined
    public get selectedHostId(): string | undefined {
        return this._selectedHostId;
    }
    public set selectedHostId(value: string | undefined) {
        this._selectedHostId = value;
    }

    
    private _selectedTags: string[] = [];
    public get selectedTags(): string[] {
        return this._selectedTags;
    }
    public set selectedTags(value: string[]) {
        this._selectedTags = value;
    }

    constructor() {
        makeAutoObservable(this)
    }
}