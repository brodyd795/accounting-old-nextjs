export const checkIsAdmin = user =>
	Boolean(process.env.ADMIN_EMAILS.includes(user));
