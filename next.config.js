const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	// eslint-disable-next-line get-off-my-lawn/prefer-arrow-functions
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: {
				test: /\.(js|ts)x?$/
			},
			use: ['@svgr/webpack']
		});

		return config;
	},
	env: {
		db_user: process.env.DB_USER,
		AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
		AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
		AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
		AUTH0_SCOPE: process.env.AUTH0_SCOPE,
		REDIRECT_URI:
			process.env.REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
		POST_LOGOUT_REDIRECT_URI:
			process.env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000/',
		SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
		SESSION_COOKIE_LIFETIME: 7200, // 2 hours
		ADMIN_EMAILS: process.env.ADMIN_EMAILS
	},
	basePath: 'accounting'
};
