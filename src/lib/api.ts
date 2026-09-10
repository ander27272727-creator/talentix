import { useStore } from '@/store/useStore'

/**
 * apiFetch: wrapper de fetch que adjunta el header x-user-id de la sesión activa.
 * Los APIs del servidor lo usan para autorizar por rol.
 */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const userId = useStore.getState().user?.id
  const headers = new Headers(init.headers)
  if (userId) {
    headers.set('x-user-id', userId)
  }
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return fetch(input, { ...init, headers })
}
