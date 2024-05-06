import { any, literal, object, variant } from 'valibot';

export type SuccessResult<TData> = {
	ok: true;
	data: TData;
};

export type FailureResult<TError = string> = {
	ok: false;
	error: TError;
};

export type Result<TData, TError = string> =
	| SuccessResult<TData>
	| FailureResult<TError>;

//TODO: replace Result to be inferred from ResultSchema
export const ResultSchema = variant('ok', [
	object({
		ok: literal(true),
		data: any(),
	}),
	object({
		ok: literal(false),
		error: any(),
	}),
]);
