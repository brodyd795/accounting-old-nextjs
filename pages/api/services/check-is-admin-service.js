export const checkIsAdmin = (user) =>
	process.env.ADMIN_EMAILS.includes(user) ? true : false;
