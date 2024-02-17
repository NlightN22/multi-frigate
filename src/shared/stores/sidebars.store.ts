import { makeAutoObservable } from "mobx"

export class SideBarsStore {
    private _leftSideBar: React.ReactNode = null
    public get leftSideBar(): React.ReactNode {
        return this._leftSideBar
    }


    private _rightSideBar: React.ReactNode = null
    public get rightSideBar(): React.ReactNode {
        return this._rightSideBar
    }

    constructor () {
        makeAutoObservable(this)
    }

    setRightSidebar = (value: React.ReactNode) => {
        this._rightSideBar = value
    }

    setLeftSidebar = (value: React.ReactNode) => {
        this._leftSideBar = value
    }
}