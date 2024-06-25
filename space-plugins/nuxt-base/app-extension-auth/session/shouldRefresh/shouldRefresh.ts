/*
 TODO: pass the date as argument, so that the function can be made pure.
 TODO: add tests for the pure function.
 */
import { AppSession } from '../types';

/**
 * Whether the server should refresh the token, while keeping some margin.
 * @param session
 */
export const shouldRefresh = (session: AppSession): boolean =>
	serverRefreshIn(session) < 0;

const marginSeconds = 60;

/**
 * How many milliseconds until the server should refresh the token, while keeping some margin.
 * @param session
 */
const serverRefreshIn = (session: AppSession): number =>
	expiresIn(session) - marginSeconds * 1000;

/**
 * When the token will expire
 * @param session
 */
const expiresIn = (session: AppSession): number =>
	session.expiresAt - Date.now();
