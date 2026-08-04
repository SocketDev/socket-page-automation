import { COOLDOWN_WINDOW_MS } from './constants.mts'
import { runChallengeAware } from './run-challenge-aware.mts'

import type { ChallengeAwareStep } from './challenge-step.mts'
import type { ChallengeAwareOptions } from './run-challenge-aware.mts'

/** A cooldown window opened by a solved challenge. */
export interface CooldownWindow {
  openedAt: number
  windowMs: number
}

/** Open a cooldown window at `openedAt` lasting `windowMs`. Pure. */
export function openCooldownWindow(
  openedAt: number,
  windowMs: number = COOLDOWN_WINDOW_MS,
): CooldownWindow {
  return { openedAt, windowMs }
}

/**
 * Whether `now` still falls inside the cooldown window, i.e. a batch of
 * operations can still ride the last approval. Pure.
 */
export function isCooldownActive(
  window: CooldownWindow | undefined,
  now: number,
): boolean {
  if (!window) {
    return false
  }
  return now - window.openedAt < window.windowMs
}

/** Options for {@link runChallengeAwareBatch}. */
export interface BatchOptions
  extends Omit<ChallengeAwareOptions, 'onChallengeCleared'> {
  windowMs?: number | undefined
}

/** The outcome of a batch run. */
export interface BatchResult<T> {
  challengesSolved: number
  cooldown: CooldownWindow | undefined
  results: T[]
}

/**
 * Run a sequence of operations through {@link runChallengeAware}, sharing one
 * cooldown window. The first solved challenge opens the window; subsequent
 * operations that finish inside it ride that single approval, which is the
 * batching the npm challenge cooldown is designed for. Returns every result,
 * the count of challenges actually solved, and the final cooldown window.
 */
export async function runChallengeAwareBatch<T>(
  operations: ReadonlyArray<() => Promise<ChallengeAwareStep<T>>>,
  options: BatchOptions,
): Promise<BatchResult<T>> {
  const opts = { __proto__: null, ...options } as BatchOptions
  const now = opts.now ?? Date.now
  const windowMs = opts.windowMs ?? COOLDOWN_WINDOW_MS
  const results: T[] = []
  let challengesSolved = 0
  let cooldown: CooldownWindow | undefined
  for (let i = 0, { length } = operations; i < length; i += 1) {
    const operation = operations[i]!
    const value = await runChallengeAware(operation, {
      budgetMs: opts.budgetMs,
      label: opts.label,
      now,
      onChallengeCleared: ({ clearedAt }) => {
        challengesSolved += 1
        cooldown = openCooldownWindow(clearedAt, windowMs)
      },
      pause: opts.pause,
    })
    results.push(value)
  }
  return { challengesSolved, cooldown, results }
}
