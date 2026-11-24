export function requireServerEnv(name: string): string {
	const value = process.env[name];
	if (!value?.trim()) {
		throw new Error(`Missing required server environment variable: ${name}`);
	}
	return value;
}

export function serverEnvSnapshot(names: string[]): Record<string, "present" | "missing"> {
	return Object.fromEntries(names.map((name) => [name, process.env[name]?.trim() ? "present" : "missing"]));
}
