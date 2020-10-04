export default redirectTo => {
	if (redirectTo) {
		return `/api/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`;
	}

	return `/api/auth/login`;
};
