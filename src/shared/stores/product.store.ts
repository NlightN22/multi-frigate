import { makeAutoObservable, runInAction } from "mobx";
import { TableAdapter } from "../components/table.aps/ProductTable";
import { GridAdapter } from "../components/grid.aps/ProductGrid";
import { sleep } from "../utils/async.sleep";
import { CartProduct } from "./cart.store";
import RootStore from "./root.store";

export type Product = {
    id: string,
    number: number,
    manufactory: string,
    oem: string,
    stock: number,
    receipt_date: string,
    name: string,
    cost: number,
    image: string[],
    discount: boolean,
    weight?: number,
    properties?: ProductProperty[]
}

export type ProductProperty = {
    id: string,
    name: string,
    value: string | string[]
}

export enum ProductSortTypes {
    byName,
    byCost,
    byQty,
}

export enum ProductFilterTypes {
    byCategory,
    byName,
    byCost,
    byOem,
    byManufactory,
    byStock,
    byDiscount
}

export class ProductStore {
    private rootStore: RootStore

    private _products: Product[] = []
    public get products() {
        return this._products
    }

    private _isLoading = false
    public get isLoading() {
        return this._isLoading
    }

    private _selectedSroting: ProductSortTypes = ProductSortTypes.byName
    public get selectedSroting(): ProductSortTypes {
        return this._selectedSroting
    }
    public set selectedSorting(value: ProductSortTypes) {
        this._selectedSroting = value
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

    updateProductFromServer = async () => {
        try {
            this._isLoading = true
            const res = await this.fetchProductFromServer()
            runInAction(() => {
                this._products = res
                this._isLoading = false
            })
        } catch {
            this._isLoading = false
        }
    }

    private async fetchProductFromServer(): Promise<Product[]> {
        return []
    }

    getFullImageLinks = async (productId: string) => {
        const res = await this.fetchFullImageLinksFromServer(productId)
        return res
    }

    getProductDetailed = async(id: string| undefined) => {
        if (id) {
            const res = await this.fetchProductDetailedFromServer(id)
            return res
        }
        return undefined
    }

    private async fetchProductDetailedFromServer(id: string): Promise<Product> {
        // const main = serverProducts.find(product => product.id === id)
        // const properties = detailedParams
        // if (main) main.properties = properties
        return {} as Product
    }

    private async fetchFullImageLinksFromServer(productId: string) {
        return this._products.find( product => product.id === productId)?.image
    }

    mapFromTable(tableItem: TableAdapter) {
        const product: Product = {
            id: tableItem.id,
            number: tableItem.number,
            manufactory: tableItem.manufactory,
            oem: tableItem.oem,
            stock: tableItem.stock,
            receipt_date: tableItem.receipt_date,
            name: tableItem.name,
            cost: tableItem.cost,
            image: tableItem.image,
            discount: tableItem.discount,
        }
        return product
    }

    mapToTable(products: Product[], cartProducts: CartProduct[]): TableAdapter[] {
        return this.addQtyFromCardData(products, cartProducts)
    }

    mapToGrid(products: Product[], cartProducts: CartProduct[]): GridAdapter[] {
        return this.addQtyFromCardData(products, cartProducts)
    }

    private addQtyFromCardData(products: Product[], cartProducts: CartProduct[]) {
        return products.map((product) => {
            const cart = cartProducts.find(cart => cart.id === product.id)
            if (cart) return { ...product, qty: cart.qty }
            return { ...product, qty: 0 }
        })
    }


}