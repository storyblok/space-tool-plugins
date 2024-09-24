import Head from 'next/head';
import { useAppBridge, useToolContext } from '@/hooks';
import UserInfo from '@/components/UserInfo';
import Example from '@/components/Example';

type User = {
	id: number;
	friendly_name: string;
};

type UserInfo = {
	user: User;
};

export default function Home() {
	const toolContext = useToolContext();
	const { completed } = useAppBridge({ type: 'tool-plugin', oauth: true });

	return (
		<>
			<Head>
				<title>Storyblok Next Tool Starter</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main>
				{completed && (
					<div>
						<p>Authenticated!</p>
						<UserInfo />
						<Example />
						{toolContext && (
							<div>
								<p>Tool Context</p>
								<p>Story: {toolContext.story.name}</p>
								<p>Slug: {toolContext.story.slug}</p>
							</div>
						)}
					</div>
				)}
			</main>
		</>
	);
}
