export default {
	extends: 'get-off-my-lawn',
	rules: {
		'react/prop-types': 0,
		'react/jsx-sort-props': 0,
		'react/jsx-no-literals': 0,
		'react/display-name': 0,
		'react/no-unescaped-entities': 0,
		'sort-keys': 0,
		'objects/no-object-properties-one-line': 0,
		'node/no-unpublished-require': 0,
		'no-await-in-loop': 0,
		'require-await': 0,
		camelcase: 0,
		'default-case': 0,
		'require-unicode-regexp': 0,
		'no-nested-ternary': 0,
		'no-alert': 0
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	}
};
