import { iceAndFireApiUrl } from '../../../config/environment'

type QueryValue = number | string | undefined

export interface ApiResponse<T> {
  data: T
  headers: Headers
}

export class IceAndFireApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'IceAndFireApiError'
    this.status = status
  }
}

export async function apiGetWithHeaders<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  signal?: AbortSignal,
): Promise<ApiResponse<T>> {
  const url = new URL(`${iceAndFireApiUrl}${path}`)

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new IceAndFireApiError(
      response.status,
      `La API de Ice and Fire respondió con estado ${response.status}.`,
    )
  }

  return {
    data: (await response.json()) as T,
    headers: response.headers,
  }
}

export async function apiGet<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  signal?: AbortSignal,
): Promise<T> {
  const response = await apiGetWithHeaders<T>(path, query, signal)
  return response.data
}
