import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as yup from 'yup';
import DatePickerField from '../tables/selectors/date-selector';
import AmountSelector from '../tables/selectors/amount-selector';
import {StyledSelect} from '../tables/styles';

const StyledModal = styled(Modal)`
    color: black;
    position: absolute;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: white;
`;

const StyledLabel = styled.label`
    color: red;
    margin-right: 10px;
`;

const validationSchema = yup.object().shape({
    fromAccountName: yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
        accountId: yup.number().required()
    }).test(
        'accounts-match',
        'To and From accounts must be different',
        function () {
            return this.parent.fromAccountName.accountId !== this.parent.toAccountName.accountId;
        }
    ),
    toAccountName: yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
        accountId: yup.number().required()
    }).test(
        'accounts-match',
        'To and From accounts must be different',
        function () {
            return this.parent.fromAccountName.accountId !== this.parent.toAccountName.accountId;
        }
    ),
    amount: yup.number().required('Required'),
    comment: yup.string().notRequired(),
    date: yup.date().required('Required')
  });

const TransactionEditModal = ({isEditing, setIsEditing, transactionBeingEdited, accounts}) => {
    if (!transactionBeingEdited) {
        return null;
    }

    const {
        amount,
        comment,
        date,
        fromAccountId,
        toAccountId
    } = transactionBeingEdited;

    const flatAccounts = accounts.reduce((acc, current) => [...acc, current.options], []).flat();
    const fromAccountOption = flatAccounts.find((account) => account.accountId === fromAccountId);
    const toAccountOption = flatAccounts.find((account) => account.accountId === toAccountId);

    return (
        <StyledModal
            isOpen={isEditing}
            contentLabel={'Edit Transaction Modal'}
            ariaHideApp={false}
            onRequestClose={() => setIsEditing(false)}
        >
            <button type={'button'} onClick={() => setIsEditing(false)}>{'X'}</button>
            <h2>{'Edit Transaction'}</h2>
            <Formik
                initialValues={{
                    fromAccountName: fromAccountOption,
                    toAccountName: toAccountOption,
                    amount: amount / 100,
                    comment,
                    date: new Date(date)
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log('values', values)
                }}
            >
                {({setFieldValue, values}) => (
                    <Form>
                        <div>
                            <StyledLabel htmlFor={'date'}>{'Date'}</StyledLabel>
                            <DatePickerField name={'date'} type={'text'} />
                            <ErrorMessage name={'date'} />
                        </div>
                        <div>
                            <StyledLabel htmlFor={'fromAccountName'}>{'From account name'}</StyledLabel>
                            <StyledSelect
                                options={accounts}
                                value={values.fromAccountName}
                                onChange={(option) => setFieldValue('fromAccountName', option)}
                                name={'fromAccountName'}
                                id={'fromAccountName'}
                            />
                            <ErrorMessage name="fromAccountName" />
                        </div>
                        <div>
                            <StyledLabel htmlFor={'toAccountName'}>{'To account namee'}</StyledLabel>
                            <StyledSelect
                                options={accounts}
                                value={values.toAccountName}
                                onChange={(option) => setFieldValue('toAccountName', option)}
                                name={'toAccountName'}
                                id={'toAccountName'}
                                />
                            <ErrorMessage name="toAccountName" />
                        </div>
                        <div>
                            <StyledLabel htmlFor={'amount'}>{'Amount'}</StyledLabel>
                            <Field name={'amount'} component={AmountSelector} />
                            <ErrorMessage name={'amount'} />
                        </div>
                        <div>
                            <StyledLabel htmlFor={'comment'}>{'Comment'}</StyledLabel>
                            <Field name={'comment'} type={'text'} />
                            <ErrorMessage name={'comment'} />
                        </div>
                        <button
                            type={'button'}
                            onClick={() => setIsEditing(false)}
                        >
                            {'Cancel'}
                        </button>
                        <button
                            type={'submit'}
                        >
                            {'Update'}
                        </button>
                    </Form>
                )}
            </Formik>
        </StyledModal>
    );
};

export default TransactionEditModal;
