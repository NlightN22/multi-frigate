import { makeAutoObservable } from "mobx"

export class Validated<T> {
    private _data?: T | undefined
    public get data(): T | undefined {
        return this._data
    }
    public set data(value: T | undefined) {
        this._data = value
    }
    error?: string

    validate( condition: boolean, error: string): Validated<T> {
        let newValidated = new Validated<T>()
        if (!condition) {
            newValidated.data = this._data 
            newValidated.error = error
            return newValidated
        }
        newValidated.data = this._data
        newValidated.error =  undefined
        return newValidated
    }

    set(data?: T) {
        let newValidated = new Validated<T>()
        newValidated.data = data
        newValidated.error = this.error
        return newValidated
    }
    
}