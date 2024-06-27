import { type AppSession, isAppSession } from './AppSession';

const stub: AppSession = {
	spaceId: 123,
	userId: 12345,
	appClientId: '094uif90e',
	expiresAt: Date.now(),
	region: 'eu',
	accessToken: 'abctoken123',
	roles: ['admin'],
	userName: 'Johannes Lindgren',
	spaceName: 'My Space',
	refreshToken: '98rejf984ej89crejf98je',
};

describe('AppSession', () => {
	describe('validation', () => {
		describe('spaceId', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						spaceId: undefined,
					}),
				).toEqual(false);
			});
			it('is a number', () => {
				expect(
					isAppSession({
						...stub,
						spaceId: 123,
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						spaceId: '123',
					}),
				).toEqual(false);
			});
		});
		describe('userId', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						userId: undefined,
					}),
				).toEqual(false);
			});
			it('is a number', () => {
				expect(
					isAppSession({
						...stub,
						userId: 123,
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						userId: '123',
					}),
				).toEqual(false);
			});
		});
		describe('appClientId', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						appClientId: undefined,
					}),
				).toEqual(false);
			});
			it('is a string', () => {
				expect(
					isAppSession({
						...stub,
						appClientId: 'abc123',
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						appClientId: 123,
					}),
				).toEqual(false);
			});
		});
		describe('userName', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						userName: undefined,
					}),
				).toEqual(false);
			});
			it('is a string', () => {
				expect(
					isAppSession({
						...stub,
						userName: 'Loki Schwartz',
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						userName: 123,
					}),
				).toEqual(false);
			});
		});
		describe('spaceName', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						spaceName: undefined,
					}),
				).toEqual(false);
			});
			it('is a string', () => {
				expect(
					isAppSession({
						...stub,
						spaceName: `Loki Schwartz's Space`,
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						spaceName: 123,
					}),
				).toEqual(false);
			});
		});
		describe('roles', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						roles: undefined,
					}),
				).toEqual(false);
			});
			it('is an array', () => {
				expect(
					isAppSession({
						...stub,
						roles: [],
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						roles: {},
					}),
				).toEqual(false);
			});
			it('can be empty', () => {
				expect(
					isAppSession({
						...stub,
						roles: [],
					}),
				).toEqual(true);
			});
			it('is an array strings', () => {
				expect(
					isAppSession({
						...stub,
						roles: ['boss'],
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						roles: ['boss', 'boss', 'cleaning lady'],
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						roles: [123],
					}),
				).toEqual(false);
			});
		});
		describe('expiresAt', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						expiresAt: undefined,
					}),
				).toEqual(false);
			});
			it('is a number', () => {
				expect(
					isAppSession({
						...stub,
						expiresAt: 123,
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						expiresAt: '123',
					}),
				).toEqual(false);
			});
		});
		describe('refreshToken', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						refreshToken: undefined,
					}),
				).toEqual(false);
			});
			it('is a string', () => {
				expect(
					isAppSession({
						...stub,
						refreshToken: 'duifh89we4',
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						refreshToken: 123,
					}),
				).toEqual(false);
			});
		});
		describe('accessToken', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						accessToken: undefined,
					}),
				).toEqual(false);
			});
			it('is a string', () => {
				expect(
					isAppSession({
						...stub,
						accessToken: 'duifh89we4',
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						accessToken: 123,
					}),
				).toEqual(false);
			});
		});
		describe('region', () => {
			it('is required', () => {
				expect(
					isAppSession({
						...stub,
						region: undefined,
					}),
				).toEqual(false);
			});
			it('is a region', () => {
				expect(
					isAppSession({
						...stub,
						region: 'eu',
					}),
				).toEqual(true);
				expect(
					isAppSession({
						...stub,
						region: 'somethingrandom',
					}),
				).toEqual(false);
			});
		});
	});
});
