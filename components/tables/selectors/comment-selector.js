import React from 'react';

const CommentSelector = props => {
	const {setEditedRow, value} = props;

	const handleCommentEdit = e => {
		const comment = e.target.value;

		setEditedRow(editedRow => ({
			...editedRow,
			comment
		}));
	};

	return (
		<input
			value={value}
			onChange={handleCommentEdit}
			placeholder={'Enter description...'}
			required
		/>
	);
};

export default CommentSelector;
