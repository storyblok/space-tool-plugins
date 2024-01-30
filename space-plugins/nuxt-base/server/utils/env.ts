export const env = (key: string) => {
	const value = process.env[key] ?? '';
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(
			`[Error] Missing required environment variable: \`${key}\``
		);
	}

	return value;
};
