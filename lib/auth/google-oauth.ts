/**
 * Google OAuth Configuration and Utilities
 * Handles Google OAuth 2.0 flow with PKCE for security
 */

export interface GoogleOAuthConfig {
  clientId: string
  redirectUri: string
  scope: string[]
}

export interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
  id_token: string
}

export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

/**
 * Get Google OAuth configuration
 */
export function getGoogleOAuthConfig(): GoogleOAuthConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID environment variable is required")
  }

  return {
    clientId,
    redirectUri: `${appUrl}/api/auth/callback/google`,
    scope: ["openid", "email", "profile"],
  }
}

/**
 * Generate Google OAuth authorization URL
 */
export function generateGoogleAuthUrl(state: string, codeChallenge: string): string {
  const config = getGoogleOAuthConfig()

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scope.join(" "),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "consent",
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<GoogleTokenResponse> {
  const config = getGoogleOAuthConfig()
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientSecret) {
    throw new Error("GOOGLE_CLIENT_SECRET environment variable is required")
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token exchange failed: ${error}`)
  }

  return response.json()
}

/**
 * Get user info from Google API
 */
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get user info: ${error}`)
  }

  return response.json()
}
