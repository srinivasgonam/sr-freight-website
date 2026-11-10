// Single entry point for API calls.
// Normal builds talk to the Express server. The static build (GitHub Pages, no server)
// answers the public endpoints in the browser instead — see staticApi.ts.
export const IS_STATIC_SITE = import.meta.env.VITE_STATIC_SITE === 'true'

export async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  if (IS_STATIC_SITE) {
    const { staticApi } = await import('./staticApi')
    return staticApi(url, init)
  }
  return fetch(url, init)
}
