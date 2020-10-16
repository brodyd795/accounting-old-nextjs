const selectStyles = {
	control: base => ({
		...base,
		minHeight: 10
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 1
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px'
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0
	}),
	groupHeading: base => ({
		...base,
		padding: '3px 6px'
	}),
	group: base => ({
		...base,
		padding: 0
	}),
	option: base => ({
		...base,
		padding: '3px 6px'
	})
};

export default selectStyles;
