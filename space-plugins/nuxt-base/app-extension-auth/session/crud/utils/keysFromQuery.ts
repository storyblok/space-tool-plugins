import type { AppSessionKeys, AppSessionQuery } from '../../types';
import { numberFromString } from '../../../utils';

export const keysFromQuery = (keys: AppSessionQuery): AppSessionKeys => {
	const { spaceId, userId } = keys;
	return {
		spaceId:
			typeof spaceId === 'number' ? spaceId : numberFromString(spaceId) ?? NaN,
		userId:
			typeof userId === 'number' ? userId : numberFromString(userId) ?? NaN,
	};
};
