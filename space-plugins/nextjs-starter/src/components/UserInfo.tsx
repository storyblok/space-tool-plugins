import { useEffect, useState } from 'react';

export default function UserInfo() {
	const [userInfo, setUserInfo] = useState(null);
	useEffect(() => {
		const fetchUserInfo = async () => {
			const response = await fetch('/api/user_info');
			const json = await response.json();
			setUserInfo(json);
		};
		fetchUserInfo();
	}, []);

	return <pre>{JSON.stringify(userInfo, null, 2)}</pre>;
}
