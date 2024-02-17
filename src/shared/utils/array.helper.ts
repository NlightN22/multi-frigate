export function removeItem<T extends {id: string}>( item:T, array:T[]): T [] {
    const index = array.indexOf(item)
    return array.filter( old => old.id !== item.id)
}

export function removeItemById<T extends {id: string}>( id:string, array:T[]): T [] {
    return array.filter( old => old.id !== id)
}

export function removeFilter<T extends {propertyId: string}>( item:T, array:T[]): T [] {
    const index = array.indexOf(item)
    return array.filter( old => old.propertyId !== item.propertyId)
}

export function addItem<T>( item:T, array:T[]): T [] {
    return [...array, item]
}

export class List<T> extends Array<T> {
    delete(toDelete: T) {
        return this.filter( item => item !== toDelete)
    }

    add(toAdd: T) {
        return [...this, toAdd]
    }
}