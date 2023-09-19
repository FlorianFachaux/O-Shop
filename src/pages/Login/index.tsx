import './styles.scss';
import { FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import userSchema from '../../utils';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import Cookies from 'js-cookie';

interface LoginProps {
  handleLogin: (token: string) => void;
}

function Login({ handleLogin }: LoginProps) {
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState<string>('');

  // Use Formik to manage the status and validation of the login form
  const { values, errors, touched, isSubmitting, handleBlur, handleChange } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: userSchema,
      onSubmit: async () => {},
    });

  // This function will be executed after the form submission
  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/login', {
        email: values.email,
        password: values.password,
      });
      const { token } = response.data;

      const handleLoginSuccess = async (token: string) => {
        Cookies.set('authToken', token, { expires: 7 });
        const userConnected = response.data.userConnected;
        if (userConnected) {
          const isAdmin = userConnected.isAdmin;
          Cookies.set('isAdmin', isAdmin.toString(), { expires: 7 });
        }
        handleLogin(token);
        setIsLogged(true);
      };

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      handleLoginSuccess(token);
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        setError("L'email ou le mot de passe est incorrect.");
      }
    }
  };

  // Check for the presence of the authToken cookie on component mount
  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      setIsLogged(true);
    }
  }, []);

  return (
    <div className="form">
      <form onSubmit={handleSubmitForm} className="form__container">
        <h1 className="form__title">O&apos;Shop</h1>
        <h2 className="form__subtitle">Connexion</h2>
        <input
          className={`form__input--email ${
            touched.email && errors.email ? 'input-error' : 'input-valid'
          }`}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          id="email"
          type="email"
          placeholder="Email"
          required
        />
        {errors.email && touched.email && (
          <p className="login__error">{errors.email}</p>
        )}
        <input
          className={`form__input--password ${
            touched.password && errors.password ? 'input-error' : 'input-valid'
          }`}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          id="password"
          type="password"
          placeholder="Mot de passe"
          required
        />
        {errors.password && touched.password && (
          <p className="login__error">{errors.password}</p>
        )}
        <button
          disabled={isSubmitting}
          className="form__input--button"
          type="submit"
        >
          Me Connecter
        </button>
        {error && <p className="login__error">{error}</p>}
        <Link to="/signup" className="redirect">Pas encore inscrit ?</Link>
      </form>
    </div>
  );
}

export default Login;