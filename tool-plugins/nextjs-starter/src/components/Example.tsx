import { APP_BRIDGE_TOKEN_HEADER_KEY, KEY_TOKEN } from '@/utils/const';
import { useEffect, useState } from 'react';

export default function Example() {
	const [testInfo, setTestInfo] = useState<{ verified: boolean }>({
		verified: false,
	});
	useEffect(() => {
		const fetchTestInfo = async () => {
			const response = await fetch('/api/example', {
				headers: {
					[APP_BRIDGE_TOKEN_HEADER_KEY]:
						sessionStorage.getItem(KEY_TOKEN) || '',
				},
			});
			const json = await response.json();
			setTestInfo(json);
		};
		fetchTestInfo();
	}, []);

	return (
		<pre>
			App Bridge session is {testInfo?.verified ? 'verified' : 'not verified'}
		</pre>
	);
}
