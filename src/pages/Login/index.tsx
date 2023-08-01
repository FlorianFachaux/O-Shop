import './styles.scss';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import userSchema from '../../utils';
import { Link } from 'react-router-dom';

interface LoginProps {
  handleLogin: (isLogged: boolean) => void;
}

function Login({ handleLogin }: LoginProps) {
  const [isLogged, setIsLogged] = useState(false);

  //We use Formik to manage the status and validation of the login form
  const { values, errors, touched, isSubmitting, handleBlur, handleChange } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: userSchema,
      onSubmit: async () => {},
    });

  const [error, setError] = useState<string>('');

  // This function will be executed after the form submission
  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('submitted');
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: values.email,
        password: values.password,
      });
      const { token } = response.data;
      // We send the token in the localStorage and we store it
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLogged(true);
      handleLogin(true);
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        setError("L'email ou le mot de passe est incorrect.");
      }
      
    }
  };
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