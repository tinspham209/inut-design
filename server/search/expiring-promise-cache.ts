export const SEARCH_CORPUS_TTL_MS = 24 * 60 * 60 * 1000;

export function createExpiringPromiseCache<T>(ttlMs: number) {
	let pending: Promise<T> | null = null;
	let cached: { value: T; expiresAt: number } | null = null;

	return {
		get(load: () => Promise<T>): Promise<T> {
			if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value);
			if (pending) return pending;

			const promise = load();
			pending = promise;
			promise.then(
				(value) => {
					cached = { value, expiresAt: Date.now() + ttlMs };
					if (pending === promise) pending = null;
				},
				() => {
					if (pending === promise) pending = null;
				}
			);
			return promise;
		},
	};
}
