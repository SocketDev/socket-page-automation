/**
 * The npm challenge cooldown window. After one solved challenge, a BATCH of
 * subsequent operations rides that single approval for this long instead of
 * re-challenging per operation.
 */
export const COOLDOWN_WINDOW_MS = 5 * 60_000

/**
 * A human solves a verification challenge, so the budget is generous and the
 * poll is slow. This is a pause, not a retry ladder.
 */
export const CHALLENGE_BUDGET_MS = 10 * 60_000

/** How long to wait between challenge polls while the operator solves it. */
export const CHALLENGE_POLL_MS = 5000
