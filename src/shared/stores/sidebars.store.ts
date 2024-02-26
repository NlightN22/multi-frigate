import { makeAutoObservable } from "mobx"

export class SideBarsStore {

    private _rightVisible: boolean = true
    public get rightVisible(): boolean {
        return this._rightVisible
    }
    public set rightVisible(visible: boolean) {
        this._rightVisible = visible
    }
    private _leftVisible: boolean = true
    public get leftVisible(): boolean {
        return this._leftVisible
    }
    public set leftVisible(visible: boolean) {
        this._leftVisible = visible
    }

    private _leftChildren: React.ReactNode = null
    public get leftChildren(): React.ReactNode {
        return this._leftChildren
    }


    private _rightChildren: React.ReactNode = null
    public get rightChildren(): React.ReactNode {
        return this._rightChildren
    }

    constructor () {
        makeAutoObservable(this)
    }

    setRightChildren = (value: React.ReactNode) => {
        this._rightChildren = value
    }

    setLeftChildren = (value: React.ReactNode) => {
        this._leftChildren = value
    }
}