import { CHALLENGE_BUDGET_MS } from './constants.mts'

import type { ChallengeAwareStep } from './challenge-step.mts'

/**
 * The context handed to the injected pause seam on each challenge tick.
 */
export interface PauseContext {
  attempt: number
  budgetMs: number
  elapsedMs: number
  label: string
}

/**
 * The injected pause seam. A challenge is solved by a PERSON, so the runtime
 * that owns the page (Playwright, a content script, a test clock) supplies this
 * async pause. The core never touches a browser; it only orchestrates the
 * pause-then-retry rhythm around whatever pause the caller injects.
 */
export type PauseSeam = (ctx: PauseContext) => Promise<void>

/**
 * Config for {@link runChallengeAware}.
 */
export interface ChallengeAwareConfig {
  budgetMs?: number | undefined
  label: string
  now?: (() => number) | undefined
  onChallengeCleared?: ((ctx: { clearedAt: number }) => void) | undefined
  pause: PauseSeam
}

/**
 * Failure block for a challenge that outlasted its budget, in What / Where /
 * Saw vs wanted / Fix order. Pure — exported for tests.
 */
export function formatChallengeTimeout(config: {
  budgetMs: number
  label: string
}): string {
  const cfg = { __proto__: null, ...config } as typeof config
  return [
    'What: a human-verification challenge kept blocking the operation, so the run stopped rather than retrying into a rate limit.',
    `Where: ${cfg.label}`,
    `Saw: the challenge was still unsolved after ${Math.round(cfg.budgetMs / 1000)}s of waiting.`,
    'Wanted: the challenge cleared so the operation can proceed.',
    'Fix: solve the human-verification challenge, then re-run. Nothing was changed, so a re-run is safe.',
  ].join('\n')
}

/**
 * The shared anti-bot rhythm, runtime-agnostic. Runs `operation`, and each time
 * it reports a human-verification challenge, PAUSE through the injected seam
 * (bounded by the budget, NEVER a blind retry ladder), then re-attempt. A
 * `done` step returns its value; a `retry` step loops without pausing; a
 * `challenge` step pauses. When a challenge was seen and the operation then
 * finishes, `onChallengeCleared` fires once so the caller can open a cooldown
 * window for a batch of follow-up operations. The clock is injectable so tests
 * run in milliseconds.
 */
export async function runChallengeAware<T>(
  operation: () => Promise<ChallengeAwareStep<T>>,
  config: ChallengeAwareConfig,
): Promise<T> {
  const cfg = { __proto__: null, ...config } as ChallengeAwareConfig
  const budgetMs = cfg.budgetMs ?? CHALLENGE_BUDGET_MS
  const now = cfg.now ?? Date.now
  const started = now()
  let attempt = 0
  let sawChallenge = false
  for (;;) {
    attempt += 1
    const step = await operation()
    if (step.kind === 'done') {
      if (sawChallenge && cfg.onChallengeCleared) {
        cfg.onChallengeCleared({ clearedAt: now() })
      }
      return step.value
    }
    if (step.kind === 'retry') {
      continue
    }
    const elapsedMs = now() - started
    if (elapsedMs >= budgetMs) {
      throw new Error(formatChallengeTimeout({ budgetMs, label: cfg.label }))
    }
    sawChallenge = true
    await cfg.pause({ attempt, budgetMs, elapsedMs, label: cfg.label })
  }
}
