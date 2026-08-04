/** The npm website origin every session drives. */
export const NPM_ORIGIN = 'https://www.npmjs.com'

/** npm's session-identity route, read for the signed-in user. */
export const NPM_WHOAMI_PATH = '/-/whoami'

/**
 * Marker text npm's human-verification interstitial shows. A caller treats a
 * page carrying it as a challenge to pause on.
 */
export const NPM_CHALLENGE_MARKER = 'Just a moment'

/** The whoami URL for a given origin. */
export function npmWhoamiUrl(origin: string = NPM_ORIGIN): string {
  return `${origin}${NPM_WHOAMI_PATH}`
}

/** The org settings page for `org`. */
export function npmOrgUrl(org: string, origin: string = NPM_ORIGIN): string {
  return `${origin}/org/${org}`
}

/**
 * The package access-settings page for `pkg`. The package identifier is passed
 * already URL-safe (a scoped name encodes its slash, e.g. `@scope%2Fname`).
 */
export function npmPackageSettingsUrl(
  pkg: string,
  origin: string = NPM_ORIGIN,
): string {
  return `${origin}/package/${pkg}/access`
}
