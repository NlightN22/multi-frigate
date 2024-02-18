import { makeAutoObservable, runInAction } from "mobx";
import { Product } from "./product.store";
import { sleep } from "../utils/async.sleep";
import { TableAdapter } from "../../widgets/ProductTable";
import { DeliveryMethod, DeliveryMethods, PaymentMethod, PaymentMethods } from "./orders.store";
import { addItem, removeItemById } from "../utils/array.helper";
import { strings } from "../strings/strings";
import { Validated } from "../utils/validated";
import { DeliveryPoint, DeliveryPointSchema } from "./user.store";

export interface CartProduct extends Product {
    qty: number,
}

export interface OrderingStage {
    stage: number,
    path: string,
}

// TODO delete
export class CartStore {


    readonly cartStage1: OrderingStage = { stage: 0, path: 'CART_PATH' }
    readonly cartStage2: OrderingStage = { stage: 1, path: 'CART_METHOD_PATH' }
    readonly cartStage3: OrderingStage = { stage: 2, path: 'PAYMENT_PATH' }

    private _CartStages: OrderingStage[] = [
        this.cartStage1,
        this.cartStage2
    ]

    public get CartStages() {
        return this._CartStages
    }

    private _confirmedStage?: OrderingStage
    public get confirmedStage() {
        return this._confirmedStage;
    }
    private _currentStage: OrderingStage = this._CartStages[0]
    public get currentStage() {
        return this._currentStage;
    }

    private _paymentMethod = new Validated<PaymentMethod>
    public get paymentMethod() {
        return this._paymentMethod;
    }

    private _deliveryMethod = new Validated<DeliveryMethod>
    public get deliveryMethod() {
        return this._deliveryMethod;
    }

    private _deliveryDate = new Validated<Date>
    public get deliveryDate() {
        return this._deliveryDate;
    }

    private _deliveryPoint = new Validated<DeliveryPoint>
    public get deliveryPoint() {
        return this._deliveryPoint;
    }

    private _products: CartProduct[] = []
    public get products() {
        return this._products;
    }

    public get totalSum(): number {
        const totalSum = this._products.reduce((sum, productCart) => {
            const productCost = productCart.cost
            const productQty = productCart.qty
            return sum + productCost * productQty
        }, 0);
        return totalSum;
    }

    public get totalWeight(): number {
        const totalWeight = this._products.reduce((sum, product) => {
            const weight = product.weight
            const qty = product.qty
            if (weight) return sum + weight * qty
            else return sum
        }, 0)
        return totalWeight
    }

    _isLoading = false
    public get isLoading() {
        return this._isLoading;
    }

    constructor() {
        makeAutoObservable(this)
    }

    setPaymentMethod = (method: PaymentMethod) => {
        console.log("setPaymentMethod", method)
        if (method === PaymentMethods.Enum.Online) {
            this._CartStages = addItem(this.cartStage3, this._CartStages)
        } else {
            this._CartStages = this._CartStages.filter(item => item.stage !== this.cartStage3.stage)
        }
        this._paymentMethod = this._paymentMethod.set(method)
    }
    setDeliveryPoint = (point: DeliveryPoint) => {
        console.log("setDeliveryPoint", point)
        this._deliveryPoint = this.deliveryPoint.set(point)
    }
    setDeliveryDate = (date: Date) => {
        console.log("setDeliveryDate", date)
        this._deliveryDate = this.deliveryDate.set(date)
    }

    setDeliveryMethod = (method: DeliveryMethod) => {
        console.log("setDeliveryMethod", method)

        if (method == DeliveryMethods.Enum.pickup) {
            this._deliveryDate = this._deliveryDate.set(undefined)
            this._deliveryPoint = this._deliveryPoint.set(undefined)
        }
        this._deliveryMethod = this.deliveryMethod.set(method)
    }

    isPreviosStageConfirmed = (currentStage: OrderingStage): boolean => {
        const previosStage = this._CartStages[currentStage.stage - 1]
        if (this.confirmedStage && this._confirmedStage!.stage >= previosStage.stage) return true
        return false
    }

    confirmStage = (stage: OrderingStage) => {
        console.log("confirmStage", stage)
        if (stage.stage == this._confirmedStage?.stage) {
            console.log("same Stage")
            return true
        }
        switch (stage.stage) {
            case 0: {
                // return this._products.length > 0
                this._confirmedStage = stage
                return true
            }
            case 1: {
                this.validateStage1()
                const validateAll = !this._deliveryMethod.error && !this._paymentMethod.error
                    && !this._deliveryPoint.error && !this._deliveryDate.error
                if (validateAll) {
                    this._confirmedStage = stage
                    return true // todo send to server
                }
                break
            }
        }
        return false
    }

    setConfirmed = (stage?: OrderingStage) => {
        this._confirmedStage = stage
    }

    setCurrentStage = (stage: OrderingStage) => {
        this._currentStage = stage
    }

    private validateStage1() {
        const isPayment = PaymentMethods.safeParse(this._paymentMethod.data).success
        this._paymentMethod = this._paymentMethod.validate(isPayment, strings.errors.choosePaymentMethod)
        const isDelivery = DeliveryMethods.safeParse(this._deliveryMethod.data).success
        this._deliveryMethod = this._deliveryMethod.validate(isDelivery, strings.errors.chooseDeliveryMethod)
        if (this._deliveryMethod.data === DeliveryMethods.Enum.delivery) {
            const isDeliveryPoint = DeliveryPointSchema.safeParse(this._deliveryPoint.data).success
            this._deliveryPoint = this._deliveryPoint.validate(isDeliveryPoint, strings.errors.chooseDeliveryPoint)
            const isDeliveryDate = this._deliveryDate.data instanceof Date
            this._deliveryDate = this._deliveryDate.validate(isDeliveryDate, strings.errors.chooseDate)
        }
    }

    updateCartFromServer = async () => {
        try {
            this._isLoading = true
            const res = await this.fetchCartFromServer()
            runInAction(() => {
                this._products = res
            })
        } catch (error) {
            console.error(error)
        } finally {
            runInAction(() => {
                this._isLoading = false
            })
        }
    }

    setToCart = async (product: Product, productQty: number) => {
        if (product) {
            const currentValue = this._products.find(productCart => productCart.id === product.id)
            if (currentValue) {
                if (productQty === 0) this._products = this._products.filter(item => item !== currentValue)
                if (productQty > 0) this._products = this._products.map(item => {
                    if (item.id === currentValue.id) return { ...item, qty: productQty }
                    return item
                })
            } else if (productQty > 0) {
                this._products.push({ ...product, qty: productQty })
            }
        }
    }

    deleteFromCart = (id: string) => {
        this._products = removeItemById(id, this._products)
    }

    sortCart = (reverse: boolean) => {
        this._products = this._products.reverse()
    }

    private async sendCartToServer(card: CartProduct) {
        await sleep(100)
    }

    private async deleteCartFromServer(card: CartProduct) {
        await sleep(100)
    }

    private async fetchCartFromServer(): Promise<CartProduct[]> {
        await sleep(300)
        if (this._products) return this._products
        return []
    }

    mapFromTable(tableItem: TableAdapter) {
        const cart: CartProduct = {
            ...tableItem
        }
        return cart
    }

    mapToTable(cartProduct: CartProduct): TableAdapter {
        return {
            ...cartProduct
        }
    }

}