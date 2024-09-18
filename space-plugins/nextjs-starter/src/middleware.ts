import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import appConfig from '@/config';
import { initOauthFlowUrl, authParams } from '@/auth';
import { APP_BRIDGE_TOKEN_HEADER_KEY } from '@/const';
import { verifyAppBridgeToken } from '@/utils/server';

// Limit the middleware to paths starting with `/api/`
export const config = {
	// matcher: '/api/:function*',
};

const SKIP_AUTH_FOR = ['/api/_app_bridge', '/api/_oauth'];

export async function middleware(request: NextRequest) {
	// handle 401 error after the initial oauth flow
	if (
		request.nextUrl.pathname === '/401' &&
		request.headers.get('Referer') === 'https://app.storyblok.com/'
	) {
		return NextResponse.redirect(
			new URL(
				appConfig.type === 'tool-plugin'
					? 'https://app.storyblok.com/oauth/tool_redirect'
					: 'https://app.storyblok.com/oauth/app_redirect',
			),
		);
	}

	// verify App Bridge token for all API routes
	const pathname = request.nextUrl.pathname;
	if (!pathname.startsWith('/api/')) {
		return NextResponse.next();
	}
	if (SKIP_AUTH_FOR.includes(pathname)) {
		return NextResponse.next();
	}
	if (
		[initOauthFlowUrl, `${authParams.endpointPrefix}/callback`].includes(
			pathname,
		)
	) {
		return NextResponse.next();
	}
	const token = request.headers.get(APP_BRIDGE_TOKEN_HEADER_KEY);
	const result = await verifyAppBridgeToken(token || '');
	if (result.ok) {
		return NextResponse.next();
	} else {
		return new NextResponse(null, {
			status: 401,
		});
	}
}
