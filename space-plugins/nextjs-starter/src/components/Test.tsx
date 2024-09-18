import { APP_BRIDGE_TOKEN_HEADER_KEY, KEY_TOKEN } from '@/const';
import { useEffect, useState } from 'react';

export default function Test() {
	const [response, setResponse] = useState(null);
	useEffect(() => {
		const fetchTestInfo = async () => {
			const response = await fetch('/api/test', {
				headers: {
					[APP_BRIDGE_TOKEN_HEADER_KEY]:
						sessionStorage.getItem(KEY_TOKEN) || '',
				},
			});
			const json = await response.json();
			setResponse(json);
		};
		fetchTestInfo();
	}, []);

	return (
		<div>
			<p>Response from /api/test:</p>
			<pre>{response}</pre>
		</div>
	);
}
