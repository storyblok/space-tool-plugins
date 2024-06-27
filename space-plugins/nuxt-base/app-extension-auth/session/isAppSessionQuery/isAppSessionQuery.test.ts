import { isAppSessionQuery } from './isAppSessionQuery';

describe('isAppSessionQuery', () => {
	it('should succeed when params are numbers', () => {
		expect(
			isAppSessionQuery({
				spaceId: 123,
				userId: 321,
			}),
		).toBeTruthy();
	});
	it('should succeed when params are numbers strings', () => {
		expect(
			isAppSessionQuery({
				spaceId: '123',
				userId: '321',
			}),
		).toBeTruthy();
	});
	it('should fail when userId is missing', () => {
		expect(
			isAppSessionQuery({
				spaceId: '123',
			}),
		).toBeFalsy();
	});
	it('should fail when spaceId is missing', () => {
		expect(
			isAppSessionQuery({
				userId: '1234',
			}),
		).toBeFalsy();
	});
	it('should fail for numbers', () => {
		expect(isAppSessionQuery(1234)).toBeFalsy();
	});
	it('should fail for strings', () => {
		expect(isAppSessionQuery('abcs')).toBeFalsy();
	});
	it('should fail for null', () => {
		expect(isAppSessionQuery(null)).toBeFalsy();
	});
	it('should fail for undefined', () => {
		expect(isAppSessionQuery(undefined)).toBeFalsy();
	});
	it('should fail for arrays', () => {
		expect(isAppSessionQuery(['abc'])).toBeFalsy();
	});
});
