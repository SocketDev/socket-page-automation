import { describe, expect, it } from 'vitest'

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
