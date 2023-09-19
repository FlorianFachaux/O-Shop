// On importe ReactDom qui nous permettra d'injecter notre application dans le DOM
import ReactDOM from 'react-dom/client';
// On importe notre BrowserRouter afin d'utiliser le router-react
import { BrowserRouter } from 'react-router-dom';
// On importe notre composant principal
import App from './pages/App';
// On importe notre fichier de style global
import './styles/index.scss';
import { Provider } from 'react-redux';
import store from './Redux/store';
// Je créer un root pour mon application (a partir d'un élément HTML)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// On injecte notre application dans le DOM
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
