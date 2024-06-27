import { hasKey } from '../../../utils';
import type { Space } from './Space';

export const isSpace = (obj: unknown): obj is Space =>
	hasKey(obj, 'id') &&
	typeof obj.id === 'number' &&
	hasKey(obj, 'name') &&
	typeof obj.name === 'string';
