import React, {useState} from 'react';
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
    width: 300px;
`;

const StyledModalHeader = styled.div`
    text-align: center;
    position: relative;
`;

const StyledModalHeading = styled.span`
    font-size: 20px;
`;

const StyledCloseModalButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    border: none;
    margin-top: 5px;
`;

const StyledLabel = styled.label`
    margin-right: 10px;
    margin-bottom: 5px;
`;

const StyledForm = styled(Form)`
    margin-top: 30px;
`;

const StyledFieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`;

const StyledButtonsContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
`;

const StyledButton = styled.button`
    margin-right: 5px;
    margin-left: 5px;
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
    const [updateStatusMessage, setUpdateStatusMessage] = useState('');

    if (!transactionBeingEdited) {
        return null;
    }

    const {
        amount,
        comment,
        date,
        fromAccountId,
        toAccountId,
        transactionId
    } = transactionBeingEdited;

    const handleSubmit = async (values) => {
        const {amount, comment, date, fromAccountName, toAccountName} = values;
        const res = await fetch(
            `/api/controllers/transactions/edit`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fromAccountId: fromAccountName.accountId,
                    toAccountId: toAccountName.accountId,
                    amount: amount * 100,
                    comment,
                    date,
                    transactionId
                })
            }
        );

        if (res.status === 200) {
            setUpdateStatusMessage('Success!');
        } else {
            setUpdateStatusMessage('Sorry, something went wrong.');
        }
    };

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
            <StyledModalHeader>
                <StyledModalHeading>{'Edit Transaction'}</StyledModalHeading>
                <StyledCloseModalButton
                    type={'button'}
                    onClick={() => setIsEditing(false)}
                >
                    {'X'}
                </StyledCloseModalButton>
            </StyledModalHeader>
            <Formik
                initialValues={{
                    fromAccountName: fromAccountOption,
                    toAccountName: toAccountOption,
                    amount: amount / 100,
                    comment,
                    date: new Date(date)
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({setFieldValue, values}) => (
                    <StyledForm>
                        <StyledFieldContainer>
                            <StyledLabel htmlFor={'date'}>{'Date'}</StyledLabel>
                            <DatePickerField name={'date'} type={'text'} />
                            <ErrorMessage name={'date'} />
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                            <StyledLabel htmlFor={'fromAccountName'}>{'From account name'}</StyledLabel>
                            <StyledSelect
                                options={accounts}
                                value={values.fromAccountName}
                                onChange={(option) => setFieldValue('fromAccountName', option)}
                                name={'fromAccountName'}
                                id={'fromAccountName'}
                            />
                            <ErrorMessage name="fromAccountName" />
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                            <StyledLabel htmlFor={'toAccountName'}>{'To account name'}</StyledLabel>
                            <StyledSelect
                                options={accounts}
                                value={values.toAccountName}
                                onChange={(option) => setFieldValue('toAccountName', option)}
                                name={'toAccountName'}
                                id={'toAccountName'}
                                />
                            <ErrorMessage name="toAccountName" />
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                            <StyledLabel htmlFor={'amount'}>{'Amount'}</StyledLabel>
                            <Field name={'amount'} component={AmountSelector} />
                            <ErrorMessage name={'amount'} />
                        </StyledFieldContainer>
                        <StyledFieldContainer>
                            <StyledLabel htmlFor={'comment'}>{'Comment'}</StyledLabel>
                            <Field name={'comment'} type={'text'} />
                            <ErrorMessage name={'comment'} />
                        </StyledFieldContainer>
                        <StyledButtonsContainer>
                            <StyledButton
                                type={'button'}
                                onClick={() => setIsEditing(false)}
                            >
                                {'Cancel'}
                            </StyledButton>
                            <StyledButton
                                type={'submit'}
                            >
                                {'Update'}
                            </StyledButton>
                        </StyledButtonsContainer>
                        <div>
                            {updateStatusMessage}
                        </div>
                    </StyledForm>
                )}
            </Formik>
        </StyledModal>
    );
};

export default TransactionEditModal;
