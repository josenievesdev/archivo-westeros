import { iceAndFireApiUrl } from '../../../config/environment'

type QueryValue = number | string | undefined

export class IceAndFireApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'IceAndFireApiError'
    this.status = status
  }
}

export async function apiGet<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  signal?: AbortSignal,
): Promise<T> {
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

  return response.json() as Promise<T>
}
