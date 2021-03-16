import React from 'react';

import EditableRowEditingMode from './editable-row-editing-mode';
import EditableRowStaticMode from './editable-row-static-mode';

const EditableRow = ({
	index,
	row,
	remove,
	edit,
	isEditing,
	showBalances
}) => {
	return (
		<EditableRowStaticMode
			index={index}
			row={row}
			showBalances={showBalances}
			isEditing={isEditing}
			remove={remove}
			edit={edit}
		/>
	);
};

export default EditableRow;
