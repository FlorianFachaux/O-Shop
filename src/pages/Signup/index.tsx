import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import userSchema from '../../utils';
import './styles.scss';
import { useState } from 'react';
import axiosInstance from '../../utils/axios';

// This variable is used to define what are the specificities of each field with formiks help
const SignupSchema = Yup.object().shape({
  firstname: Yup.string().required('Champ requis'),
  lastname: Yup.string().required('Champ requis'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Le numéro de téléphone ne peut contenir que des chiffres')
    .matches(/^[0-9]{10}$/, 'Le numéro de téléphone doit comporter 10 chiffres')
    .required('Champs requis'),
  address: Yup.string().required('Champ requis'),
  city: Yup.string().required('Champ requis'),
  postalCode: Yup.string().required('Champ requis'),
  email: userSchema.fields.email,
  password: userSchema.fields.password,
});

interface SignupFormValues {
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  password: string;
}

const initialValues = {
  firstname: '',
  lastname: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  email: '',
  password: '',
};

function Signup(): JSX.Element {
  const navigate = useNavigate();

  // These states are used to dislay the account message
  const [accountAlreadyExists, setAccountAlreadyExists] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = async (
    values: SignupFormValues,
    { resetForm }: FormikHelpers<SignupFormValues>
  ) => {
    try {
      // get email response from database.
      const emailCheckResponse = await axiosInstance.get(
        `/check-email?email=${values.email}`
      );
      if (emailCheckResponse.data.exists === true) {
        // If the email already exists in the database, print error :
        console.log('Email already exists!');
        setAccountAlreadyExists(true);
        setIsFormSubmitted(true);
      } else {
        // If the email does not exist, proceed with the signup
        const signupResponse = await axiosInstance.post(
          '/signup',
          values
        );
        console.log(signupResponse.data); // Log the API response
        setIsFormSubmitted(true);

        setTimeout(() => {
          resetForm();
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="form">
      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form className="form__container">
            <h1 className="form__title">O&apos;Shop</h1>
            <h2 className="form__subtitle">Inscription</h2>
            <div className="form__input--container">
              <Field
                className="form__input--firstname"
                type="text"
                name="firstname"
                placeholder="Prénom"
              />
              <ErrorMessage
                name="firstname"
                component="div"
                className="form__error"
              />
            </div>
            <div className="form__input--container">
              <Field
                className="form__input--lastname"
                type="text"
                name="lastname"
                placeholder="Nom"
              />
              <ErrorMessage
                name="lastname"
                component="div"
                className="form__error"
              />
            </div>
            <div className="form__input--container">
              <Field
                className="form__input--address"
                type="text"
                name="address"
                placeholder="Adresse"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="form__error"
              />
            </div>
            <div className="form__input--container">
              <Field
                className="form__input--city"
                type="text"
                name="city"
                placeholder="Ville"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="form__error"
              />
            </div>
            <div className="form__input--container">
              <Field
                className="form__input--postalCode"
                type="text"
                name="postalCode"
                placeholder="Code Postale"
              />
              <ErrorMessage
                name="postalCode"
                component="div"
                className="form__error"
              />
            </div>
            <div className="form__input--container">
              <Field
                className="form__input--phone"
                name="phone"
                placeholder="Numéro de téléphone"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="form__error"
              />
            </div>
            <div className="form__input--container">
              <Field
                className="form__input--email"
                type="email"
                name="email"
                placeholder="Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="form__error"
              />
            </div>
            <div className="form__input--container">
              <Field
                className="form__input--password"
                type="password"
                name="password"
                placeholder="Mot de passe"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="form__error"
              />
            </div>
            <button
              className="form__input--button"
              type="submit"
              disabled={formikProps.isSubmitting}
            >
              M&apos;inscrire
            </button>
            <div>
              {isFormSubmitted && (
                <p
                  className={`form__message ${
                    accountAlreadyExists
                      ? 'form__message--already-exists'
                      : 'form__message--success'
                  }`}
                >
                  {accountAlreadyExists
                    ? 'Le compte existe déjà.'
                    : 'Inscription réussie !'}
                </p>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
