import { describe, expect, it } from 'vitest'

import {
  npmOrgUrl,
  npmPackageSettingsUrl,
  npmWhoamiUrl,
} from '../../src/npm/facts.mts'

describe('npm facts', () => {
  it('builds absolute urls from the website origin', () => {
    expect(npmWhoamiUrl()).toBe('https://www.npmjs.com/-/whoami')
    expect(npmOrgUrl('socket')).toBe('https://www.npmjs.com/org/socket')
    expect(npmPackageSettingsUrl('@scope%2Fname')).toBe(
      'https://www.npmjs.com/package/@scope%2Fname/access',
    )
  })
})
