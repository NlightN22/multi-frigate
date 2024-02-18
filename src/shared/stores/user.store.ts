import { makeAutoObservable, runInAction } from "mobx"
import { User } from "oidc-client-ts";
import { Resource } from "../utils/resource"
import { sleep } from "../utils/async.sleep";
import { z } from 'zod'
import { keycloakConfig } from "../..";


export interface UserServer {
    id: string
    shortName: string
    firstName?: string
    middleName?: string
    lastName?: string
    avatar?: string
    email: string
    phone: string
    warehouse: string
    defaultCondition: string
    managerName?: string
    managerPhone?: string
    taxNumber?: string
    deliveryPoints?: DeliveryPoint[]
}
export const DeliveryPointSchema = z.object({
    id: z.string(),
    name: z.string(),
    schedule: z.string(),
    address: z.string(),
})

export type DeliveryPoint = z.infer<typeof DeliveryPointSchema>

export class UserStore {
    private _user: Resource<UserServer> = new Resource<UserServer>
    public get user() {
        return this._user;
    }

    public get fullname() {
        return `${this._user.data?.firstName} ${this._user.data?.middleName} ${this._user.data?.lastName}`
    }

    public get userAbbrevation() {
        const firstChar = this._user.data?.firstName ? this._user.data.firstName.charAt(0) : this._user.data?.shortName.charAt(0)
        const secondChar = this._user.data?.middleName ? this._user.data.middleName.charAt(0) : this._user.data?.lastName?.charAt(0)
        return `${firstChar}${secondChar}`
    }

    constructor() {
        makeAutoObservable(this)
    }

    updateUser = async () => {
        this._user.isLoading = true
        const res = await this.fetchUserFromServer()
        try {
            runInAction( () => {
                this._user = {...this._user, data: res}
            })
        } catch (error) {
            console.error(error)
        } finally {
            this._user.isLoading = false
        }
    }

    async fetchUserFromServer(): Promise<UserServer> {
        await sleep(500)
        return {} as UserServer
    }

    getSessionStorage() {
        const oidcStorage = sessionStorage.getItem(`oidc.user:${keycloakConfig.authority}:${keycloakConfig.client_id}`)
        if (!oidcStorage) {
            return undefined;
        }

        return User.fromStorageString(oidcStorage)
    }

    getUser() {
        return this.getSessionStorage()?.profile
    }

    getAccessToken() {
        return this.getSessionStorage()?.access_token
    }

}

export default UserStore
