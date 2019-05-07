
export interface ListQueryResultsDTO<T> {
    readonly limit: number,
    readonly page: number,
    readonly totalPageCount: number,
    readonly values: T[]
}