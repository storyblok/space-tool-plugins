import jwt from 'jsonwebtoken';

export const signData =
	(secret: string) =>
	<Data>(data: Data) =>
		jwt.sign({ data }, secret);
