import { safeParse } from 'valibot';
import {
	ResultSchema,
	type FailureResult,
	type Result,
	type SuccessResult,
} from '../../types';

export const success = <TData>(data: TData): SuccessResult<TData> => ({
	ok: true,
	data,
});

export const failure = <TError = string>(
	error: TError,
): FailureResult<TError> => ({
	ok: false,
	error,
});

export const isSuccess = <TData>(
	result: Result<TData>,
): result is SuccessResult<TData> => {
	return result.ok;
};

export const isFailure = <TData, TError = string>(
	result: Result<TData, TError>,
): result is FailureResult<TError> => {
	return !result.ok;
};

export const isResult = <T>(data: T | Result<T>): data is Result<T> =>
	safeParse(ResultSchema, data).success;

export const createResponse = <T>(input: Result<T> | T): T => {
	if (!isResult(input)) {
		return input;
	}

	if (input.ok) {
		return input.data;
	}

	throw createError({ statusMessage: input.error, statusCode: 500 });
};
