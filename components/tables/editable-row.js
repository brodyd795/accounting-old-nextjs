import React from 'react';

import EditableRowEditingMode from './editable-row-editing-mode';
import EditableRowStaticMode from './editable-row-static-mode';

const EditableRow = ({
	index,
	row,
	remove,
	edit,
	cancel,
	save,
	isEditing,
	idBeingEdited,
	accounts,
	showBalances
}) => {
	console.log('row.trn_id', row.trn_id)
	return isEditing && idBeingEdited === row.trn_id ? (
		<EditableRowEditingMode
			accounts={accounts}
			showBalances={showBalances}
			save={save}
			row={row}
			cancel={cancel}
		/>
	) : (
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
