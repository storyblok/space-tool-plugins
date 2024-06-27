import { hasKey } from '../../../utils';
import type { CustomRole, Role, StoryblokRole } from './Role';

export const isRole = (obj: unknown): obj is Role =>
	isStoryblokRole(obj) || isCustomRole(obj);

export const isStoryblokRole = (obj: unknown): obj is StoryblokRole =>
	hasKey(obj, 'name') && typeof obj.name === 'string';

export const isCustomRole = (obj: unknown): obj is CustomRole =>
	hasKey(obj, 'id') &&
	typeof obj.id === 'number' &&
	hasKey(obj, 'role') &&
	typeof obj.role === 'string';
