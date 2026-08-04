import { describe, expect, it } from 'vitest'

import {
  NPM_ORIGIN,
  npmOrgUrl,
  npmPackageSettingsUrl,
  npmWhoamiUrl,
} from '../../src/npm/facts.mts'
import {
  bulkActionApplyLocator,
  bulkActionRowCheckboxLocator,
  COOLDOWN_OPTIN_SELECTOR,
  trustedPublisherFieldLocator,
} from '../../src/npm/selectors.mts'

describe('npm cooldown opt-in', () => {
  it("targets npm's didOptForCooldown checkbox", () => {
    expect(COOLDOWN_OPTIN_SELECTOR).toContain('didOptForCooldown')
  })
})

describe('npm facts', () => {
  it('builds absolute urls from the website origin', () => {
    expect(npmWhoamiUrl()).toBe(`${NPM_ORIGIN}/-/whoami`)
    expect(npmOrgUrl('socket')).toBe(`${NPM_ORIGIN}/org/socket`)
    expect(npmPackageSettingsUrl('@scope%2Fname')).toBe(
      `${NPM_ORIGIN}/package/@scope%2Fname/access`,
    )
  })
})

describe('npm stub locators', () => {
  it('carry a selector and a human description', () => {
    for (const hint of [
      bulkActionRowCheckboxLocator(),
      bulkActionApplyLocator(),
      trustedPublisherFieldLocator('owner'),
    ]) {
      expect(hint.selector.length).toBeGreaterThan(0)
      expect(hint.description.length).toBeGreaterThan(0)
    }
  })
})
