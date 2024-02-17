import { makeAutoObservable, runInAction } from "mobx"
import RootStore from "./root.store"
import { Product } from "./product.store"
import { Resource } from "../utils/resource"

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

    private _isProductDetailedOpened = false
    public get isProductDetailedOpened() {
        return this._isProductDetailedOpened
    }

    private _productDetailed = new Resource<Product>
    public get productDetailed(): Resource<Product> {
        return this._productDetailed
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

    closeProductDetailed = () => {
        this._productDetailed = { isLoading: false, data: undefined }
        this._isProductDetailedOpened = false
    }

    openProductDetailed = async (id: string) => {
        try {
            runInAction(() => {
                this._productDetailed.isLoading = true
                this._isProductDetailedOpened = true
            })
            const res = await this.rootStore.productStore.getProductDetailed(id) // todo make this one instance or aborted
            runInAction(() => {
                if (res) {
                    this._productDetailed = { ...this._productDetailed, data: res }
                }
            })
        } catch (error) {
            if (error instanceof Error) this._productDetailed.error = error
        } finally {
            this._productDetailed.isLoading = false
        }
    }


}