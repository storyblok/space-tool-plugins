import { isUserInfo } from './isUserInfo';
import type { User } from '../User';
import type { Space } from '../Space';
import type { Role } from '../Role';

const user: User = {
	id: 123,
	friendly_name: 'Johannes Lindgren',
};
const space: Space = {
	id: 123456,
	name: 'My Space',
};
const roles: Role[] = [
	{
		name: 'admin',
	},
	{
		name: 'developer',
	},
];

describe('isUserInfo', () => {
	it('should be true', () => {
		expect(
			isUserInfo({
				user,
				space,
				roles,
			}),
		).toBeTruthy();
	});
	it('should be false when user is missing', () => {
		expect(
			isUserInfo({
				space,
				roles,
			}),
		).toBeFalsy();
	});
	it('should be false when space is missing', () => {
		expect(
			isUserInfo({
				user,
				roles,
			}),
		).toBeFalsy();
	});
	it('should be false when roles is missing', () => {
		expect(
			isUserInfo({
				user,
				space,
			}),
		).toBeFalsy();
	});
	it('should be false when user is wrong type', () => {
		expect(
			isUserInfo({
				user: 'Johannes',
				roles,
				space,
			}),
		).toBeFalsy();
	});
	it('should be false when space is wrong type', () => {
		expect(
			isUserInfo({
				user,
				space: 'My space',
				roles,
			}),
		).toBeFalsy();
	});
	it('should be false when role is wrong type', () => {
		expect(
			isUserInfo({
				user,
				space,
				roles: 'admin, dev',
			}),
		).toBeFalsy();
	});
	it('should be false when undefined', () => {
		expect(isUserInfo(undefined)).toBeFalsy();
	});
});
