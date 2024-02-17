export class Resource<T> {
    isLoading: boolean = false
    data: T | undefined
    error?: Error
}