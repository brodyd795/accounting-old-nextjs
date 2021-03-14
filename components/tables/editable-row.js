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
	transactionBeingEdited,
	accounts,
	showBalances
}) => {
	return isEditing && transactionBeingEdited === row.trn_id ? (
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
