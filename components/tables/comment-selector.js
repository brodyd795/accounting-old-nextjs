const CommentSelector = props => {
	const {setEditedRow, comment} = props;

	const handleCommentEdit = e => {
		const comment = e.target.value;

		setEditedRow(editedRow => ({
			...editedRow,
			comment
		}));
	};

	return <input value={comment} onChange={handleCommentEdit} />;
};

export default CommentSelector;
