const isProd = process.env.NODE_ENV === "production";

module.exports = {
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: {
				test: /\.(js|ts)x?$/,
			},
			use: ["@svgr/webpack"],
		});

		return config;
	},
	env: {
		db_user: process.env.DB_USER,
	},
	assetPrefix: isProd ? "https://dingel.dev/money" : "",
};
