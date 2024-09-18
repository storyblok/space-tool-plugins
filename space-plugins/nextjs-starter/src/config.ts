type Config = {
	type: 'space-plugin' | 'tool-plugin';
	oauth: boolean;
};

const config: Config = {
	type: 'space-plugin',
	oauth: true,
};

export default config;
