/**
 * PKCE (Proof Key for Code Exchange) utilities
 * Provides security for OAuth 2.0 authorization code flow
 */

/**
 * Generate a cryptographically random string
 */
function generateRandomString(length: number): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
  let result = ""

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    // Browser environment
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length]
    }
  } else {
    // Node.js environment
    const crypto = require("crypto")
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor((crypto.randomBytes(1)[0] / 256) * charset.length)]
    }
  }

  return result
}

/**
 * Generate SHA256 hash and base64url encode
 */
async function sha256(plain: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    // Browser environment
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    const digest = await crypto.subtle.digest("SHA-256", data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
  } else {
    // Node.js environment
    const crypto = require("crypto")
    return crypto
      .createHash("sha256")
      .update(plain)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
  }
}

/**
 * Generate PKCE code verifier
 */
export function generateCodeVerifier(): string {
  return generateRandomString(128)
}

/**
 * Generate PKCE code challenge from verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  return sha256(verifier)
}

/**
 * Generate state parameter for OAuth
 */
export function generateState(): string {
  return generateRandomString(32)
}

/**
 * Generate complete PKCE parameters
 */
export async function generatePKCEParams() {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateState()

  return {
    codeVerifier,
    codeChallenge,
    state,
  }
}
