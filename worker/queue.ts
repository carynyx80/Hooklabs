// Minimal in-memory queue with idempotency + retries (Redis optional upgrade path).
// For production: swap imports to BullMQ with REDIS_URL; interface stays identical.
export interface Job {
  key: string;
  run: () => Promise<void>;
  retries?: number;
}

const seen = new Set<string>();

export async function enqueue(job: Job) {
  if (seen.has(job.key)) return 'duplicate-suppressed';
  seen.add(job.key);
  const max = job.retries ?? 3;
  let attempt = 0;
  while (attempt <= max) {
    try {
      await job.run();
      return 'ok';
    } catch (e) {
      attempt++;
      if (attempt > max) throw e;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
}
