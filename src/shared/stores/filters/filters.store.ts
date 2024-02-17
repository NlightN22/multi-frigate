import { makeAutoObservable, runInAction } from "mobx"
import { sleep } from "../../utils/async.sleep"
import { ServerFilter } from "./filters.interface"
import { addItem, removeFilter, removeItem } from "../../utils/array.helper"
import { valueIsNotEmpty } from "../../utils/any.helper"


export class FiltersStore {
    private _filters: ServerFilter[] = []
    public get filters(): ServerFilter[] {
        return this._filters
    }

    private _showAll: boolean = false
    public get showAll(): boolean {
        return this._showAll
    }

    private _isLoading = false
    public get isLoading() {
        return this._isLoading
    }

    constructor() {
        makeAutoObservable(this)
    }

    updateFilters = async (categoryId: string) => {
        this._isLoading = true
        try {
            const res = await this.fetchFiltersFromServer(categoryId)
            runInAction(() => {
                this._filters = res.sort((a, b) => (a.priority || 0) - (b.priority || 0))
                this.setDefaultVisible()
                this._isLoading = false
            })
        } catch {
            this._isLoading = false
        }
    }

    handleChangeFilter = (id: string, value: any) => {
        const changedFilter = this._filters.find(filter => filter.id === id)
        if (changedFilter) {
            console.log(changedFilter)
            if (valueIsNotEmpty(value)) this.setFilterVisible(changedFilter, true)
            // todo add send state to product store and to update products from server
        }
    }

    offAlwaysVisible = (id: string) => {
        const changedFilter = this._filters.find(filter => filter.id === id)
        if (changedFilter) {
            this.setFilterVisible(changedFilter, false)
        }
    }

    setSpoilerVisible = (value: boolean) => {
        if (value) {
            this.showAllFilters()
        } else {
            this.setDefaultVisible()
        }
    }

    private setFilterVisible = (filter: ServerFilter, value: boolean) => {
        this._filters = this._filters.map(item => {
            if (item.id === filter.id && !item.defaultVisible) return { ...item, visible: value, alwaysVisible: value }
            else return item
        })
    }

    private showAllFilters = () => {
        this._filters = this._filters.map(filter => ({ ...filter, visible: true }))
        this._showAll = true
    }

    private setDefaultVisible() {
        this._filters = this._filters.map(filter => ({ ...filter, visible: filter.alwaysVisible ? filter.alwaysVisible : filter.defaultVisible }))
        this._showAll = false
    }

    private async fetchFiltersFromServer(categoryId: string): Promise<ServerFilter[]> {
        await sleep(500)
        return []
    }

}