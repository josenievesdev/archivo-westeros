export interface ResourceListParams {
  page?: number
  pageSize?: number
  name?: string
}

export interface ResourcePagination {
  firstPage: number | null
  previousPage: number | null
  nextPage: number | null
  lastPage: number | null
}

export interface ResourcePage<T> {
  items: T[]
  page: number
  pageSize: number
  pagination: ResourcePagination
}
