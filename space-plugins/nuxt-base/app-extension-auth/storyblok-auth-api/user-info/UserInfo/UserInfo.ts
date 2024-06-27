/**
 * The data that is returned from https://app.storyblok.com/oauth/user_info
 */
import type { User } from '../User';
import type { Space } from '../Space';
import type { Role } from '../Role';

export type UserInfo = {
	user: User;
	space: Space;
	roles: Role[];
};
