import { makeAutoObservable, runInAction } from "mobx"
import { sleep } from "../utils/async.sleep"

export type Category = {
    id: string,
    name: string,
    childs: string[],
    parent?: string,
    isAcive: boolean,
}

export class CategoryStore {
    private _categories: Category[] = []
    public get categories(): Category[] {
        return this._categories
    }

    private _selectedCategory: string = ""
    public get selectedCategory(): string {
        return this._selectedCategory
    }

    private _isLoading = false
    public get isLoading() {
        return this._isLoading
    }

    constructor () {
        makeAutoObservable(this)
    }


    updateCategories = async () => {
        try {
            this._isLoading = true
            const res = await this.fetchCategoriesFromServer()
            runInAction( () => {
                this._categories = res
                this._isLoading = false
            })
        } catch {
            this._isLoading = false
        }
    }

    selectCategory = (categoryId: string)  => {
        if (this._selectedCategory === categoryId) this._selectedCategory = ''
        else this._selectedCategory = categoryId
    }

    private async fetchCategoriesFromServer(): Promise<Category[]> {
        return []
    }

}