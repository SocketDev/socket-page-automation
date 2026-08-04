/**
 * One attempt's outcome inside {@link runChallengeAware}: a finished value, a
 * human-verification challenge to pause on, or an immediate re-attempt for a
 * transient race the operation already slept through. The runner returns on
 * `done`, pauses then re-attempts on `challenge`, and re-attempts without
 * pausing on `retry`.
 */
export type ChallengeAwareStep<T> =
  | { kind: 'challenge' }
  | { kind: 'done'; value: T }
  | { kind: 'retry' }

/** A step that finishes the operation with its resolved value. */
export function doneStep<T>(value: T): ChallengeAwareStep<T> {
  return { kind: 'done', value }
}

/** A step that reports a human-verification challenge to pause on. */
export function challengeStep<T>(): ChallengeAwareStep<T> {
  return { kind: 'challenge' }
}

/** A step that asks for an immediate re-attempt without a pause. */
export function retryStep<T>(): ChallengeAwareStep<T> {
  return { kind: 'retry' }
}
