import * as yup from 'yup';

const userSchema = yup.object().shape({
  firstname: yup.string().required('Champ requis'),
  lastname: yup.string().required('Champ requis'),
  email: yup.string().email('Veuillez saisir une adresse e-mail valide'),
  password: yup
    .string()
    .min(5, 'Le mot de passe doit contenir au moins 5 caractères')
    .matches(/[0-9]/, 'Le mot de passe doit contenir un chiffre')
    .matches(/[a-z]/, 'Le mot de passe doit contenir une lettre minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir une lettre majuscule'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Le numéro de téléphone doit comporter 10 chiffres')
    .min(10, 'Le numéro de téléphone doit comporter au moins 10 chiffres')
    .max(10, 'Le numéro de téléphone ne peut pas dépasser 10 chiffres')
    .required('Champs requis'),
});

export default userSchema;


