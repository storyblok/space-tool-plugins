import type { Role } from './Role';
import { isRole } from './isRole';

export const isRoles = (obj: unknown): obj is Role[] =>
	Array.isArray(obj) && obj.every(isRole);
