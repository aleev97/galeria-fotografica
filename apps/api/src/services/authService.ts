type GitHubUser = { id: number; login: string }

const USER_AGENT = 'astrogaia-api'

export function buildAuthorizeUrl(env: CloudflareBindings, state: string): string {
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
  url.searchParams.set('redirect_uri', `${env.PUBLIC_ORIGIN}/api/admin/auth/callback`)
  url.searchParams.set('state', state)
  url.searchParams.set('allow_signup', 'false')
  return url.toString()
}

export async function fetchGitHubUser(
  env: CloudflareBindings,
  code: string,
): Promise<GitHubUser | null> {
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${env.PUBLIC_ORIGIN}/api/admin/auth/callback`,
    }),
  })
  if (!tokenResponse.ok) return null

  const tokenData = (await tokenResponse.json()) as { access_token?: unknown }
  if (typeof tokenData.access_token !== 'string') return null

  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': USER_AGENT,
    },
  })
  if (!userResponse.ok) return null

  const user = (await userResponse.json()) as { id?: unknown; login?: unknown }
  if (typeof user.id !== 'number' || typeof user.login !== 'string') return null

  // El token de GitHub no se guarda: solo lo usamos para saber quién es
  return { id: user.id, login: user.login }
}