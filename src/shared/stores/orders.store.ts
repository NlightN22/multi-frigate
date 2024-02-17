import { makeAutoObservable } from "mobx"
import { Resource } from "../utils/resource"
import { DeliveryPoint } from "./user.store"
import { Product } from "./product.store"
import { z } from 'zod'

export interface Order {
    id: string, // uuid
    number: string,
    date: string,
    name: string,
    sum: number,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    paymentMethod?: PaymentMethod,
    deliveryMethod?: DeliveryMethod,
    deliveryPoint?: DeliveryPoint,
    deliveryDate?: Date,
    products?: Product[],
}

export interface OrterProduct extends Product{
    qty: number
}

export const PaymentMethods = z.enum([
    'Cash',
    'BankTransfer',
    'Online',
])
export type PaymentMethod = z.infer<typeof PaymentMethods>


export const DeliveryMethods = z.enum(['pickup','delivery'])
export type DeliveryMethod = z.infer<typeof DeliveryMethods>

export enum OrderStatus {
    Draft = 'draft',
    Сonfirmed = 'confirmed',
    Processed = 'processed',
    Delivering = 'delivering',
    Finished = 'finished',
    Deleted = 'deleted',
}

export enum PaymentStatus {
    Paid = 'paid',
    NotPaid = 'notpaid',
}

export class OrdersStore {

    private _orders = new Resource<Order[]>
    public get orders() {
        return this._orders
    }

    private _isLoading = false
    public get isLoading() {
        return this._isLoading
    }

    constructor () {
        makeAutoObservable(this)
    }

    updateOrders = async () => {
        this._isLoading = true
        try {
            
        } catch (error) {
            console.error(error)
        } finally {
            this._isLoading = false
        }
    }

    async fetchOrdersFromServer () {

    }

}