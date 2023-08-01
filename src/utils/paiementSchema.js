import * as yup from 'yup';

const paiementSchema = yup.object().shape({
  lastName: yup
    .string()
    .required('Champ requis')
    .matches(/^([a-zA-Z]+)\s([a-zA-Z]+)$/, 'Doit contenir un nom et un prénom'),

  cardNumbers: yup
    .number()
    .typeError('Le code doit contenir 16 chiffres')
    .test(
      'Le code doit contenir 16 chiffres',
      (val) => val && val.toString().length === 16
    )
    .required('Champ requis'),

  expiryDate: yup
    .string()
    .required('Champ requis')
    .matches(/^\d{2}\/\d{2}$/, 'Format incorrect'),

  secretCode: yup
    .number()
    .min(100, 'Code à 3 chiffres')
    .max(999, 'Code à 3 chiffres')
    .required('Champ requis'),

  termsAccepted: yup
    .bool()
    .oneOf([true], 'Acceptez les CGV pour valider le paiement')
    .required('Acceptez les CGV pour valider le paiement'),
});

export default paiementSchema;
