import { makeAutoObservable } from "mobx"
import RootStore from "./root.store"

export class ModalStore {

    private rootStore: RootStore

    private _isFullImageOpened = false
    public get isFullImageOpened() {
        return this._isFullImageOpened
    }
    private _fullImageData: string[] = []
    public get fullImageData(): string[] {
        return this._fullImageData
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

    openFullImage = (image: string[]) => {
        this._fullImageData = image
        this._isFullImageOpened = true
    }

    closeFullImage = () => {
        this._fullImageData = []
        this._isFullImageOpened = false
    }

}