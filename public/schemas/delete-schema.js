import * as yup from 'yup';

export const deleteSchema = yup.object().shape({
    transactionId: yup.number().required(),
    date: yup.date().required()
});
