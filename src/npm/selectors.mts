/**
 * A DOM locator hint the driver and content-script layers resolve into a real
 * element. It carries the selector plus a description so a stub reads clearly
 * until the consuming layer lands.
 */
export interface LocatorHint {
  description: string
  selector: string
}

/**
 * npm's challenge-cooldown opt-in checkbox. Ticking it lets a BATCH of
 * operations ride one approval instead of re-challenging per operation.
 */
export const COOLDOWN_OPTIN_SELECTOR = 'input[name="didOptForCooldown"]'

/**
 * The org/package bulk-action row checkbox. STUB for 0.1.0 — the confirmed
 * selector lands with the driver layer that drives bulk member/package
 * operations.
 */
export function bulkActionRowCheckboxLocator(): LocatorHint {
  return {
    description: 'row-selection checkbox in an org/package bulk-action table',
    selector: 'input[type="checkbox"][data-testid="bulk-select-row"]',
  }
}

/**
 * The apply-bulk-action control. STUB for 0.1.0 — the confirmed selector lands
 * with the driver layer.
 */
export function bulkActionApplyLocator(): LocatorHint {
  return {
    description:
      'submit control that applies the chosen org/package bulk action',
    selector: 'button[data-testid="bulk-apply"]',
  }
}

/** The trusted-publisher form fields npm exposes on a package's settings. */
export type TrustedPublisherField =
  | 'environment'
  | 'owner'
  | 'repository'
  | 'workflow'

/**
 * A trusted-publisher form-field locator. STUB for 0.1.0 — the confirmed
 * selectors land with the driver layer that configures trusted publishing.
 */
export function trustedPublisherFieldLocator(
  field: TrustedPublisherField,
): LocatorHint {
  return {
    description: `trusted-publisher ${field} input`,
    selector: `input[name="trustedPublisher.${field}"]`,
  }
}
