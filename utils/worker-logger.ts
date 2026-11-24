const allowList = new Set([
	"route",
	"status",
	"durationMs",
	"kind",
	"attempt",
	"errorCode",
	"memoryMB",
	"cpuMs",
]);

export function safeWorkerLogFields(fields: Record<string, unknown>): Record<string, string | number> {
	return Object.fromEntries(
		Object.entries(fields)
			.filter(([key, value]) =>
				allowList.has(key) && (typeof value === "string" || typeof value === "number"),
			)
			.map(([key, value]) => [
				key,
				typeof value === "string" ? value.slice(0, 120) : value,
			]),
	) as Record<string, string | number>;
}

export function logWorkerEvent(event: string, fields: Record<string, unknown>): void {
	console.info(event, safeWorkerLogFields(fields));
}
