export const isAdmin = user =>
	process.env.ADMIN_EMAILS.split(' ').includes(user);
