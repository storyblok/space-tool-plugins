import type { H3Event } from 'h3';
import { type BaseSchema, safeParse } from 'valibot';

export const parseQuery = <TInput>({
	event,
	schema,
}: {
	event: H3Event;
	schema: BaseSchema<TInput>;
}) => {
	const result = safeParse(schema, getQuery(event));
	if (!result.success) {
		throw createError({ status: 400 });
	}
	return result.output;
};
