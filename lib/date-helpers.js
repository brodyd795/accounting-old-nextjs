export const trnIdToHyphenatedDate = id =>
	String(id).replace(/(\d{4})(\d{2})(\d{2})\d{2}/, '$2/$3/$1');

export const trnIdToNewDate = id => {
	const year = parseInt(String(id).replace(/(^\d{4})\d+/, '$1'));
	const month = parseInt(String(id).replace(/^\d{4}(\d{2})\d+/, '$1')) - 1;
	const day = parseInt(String(id).replace(/^\d{4}\d{2}(\d{2})\d+/, '$1'));

	return new Date(year, month, day);
};

export const getMaxDate = () => new Date().setDate(new Date().getDate() + 1);
