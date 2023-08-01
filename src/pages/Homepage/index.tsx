import './styles.scss';
import coffeeIcon from '../../assets/images/Home/coffee-cup.png';
import casquetteIcon from '../../assets/images/Home/casquette.png';
import tshirt from '../../assets/images/Home/tshirt.png';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <main className="main">
      <div className="main__container">
        <h1 className="main__title">
          <span>O</span>
          &apos;Shop
        </h1>
        <p className="main__text--item">
          Bienvenue sur O&apos;Shop, LA boutique 100% O&apos;Clock !
          <br />
          Que tu sois un ancien, futur ou actuel apprenant, un enseignant de l&apos;école
          ou aspirant au développement web:
          Ne bouge pas, tu es au bon endroit !
          <br />
          Un seul objectif : te faire plaisir !
        </p>
        {/* Cards section */}
        <div className="main__cards">
          <Link to="/articles/category/thermos" className="main__card">
            <div className="main__card--wrap">
              <img className="main__card--img" src={coffeeIcon} alt="card" />
            </div>
            <h6 className="main__card--title">Des contenants pour tes carburants</h6>
            <p className="main__card--text">Peu importe si tu fais partie de la team café ou thé !</p>
          </Link>
          <Link to="/articles/category/accessoires" className="main__card">
            <div className="main__card--wrap">
              <img className="main__card--img" src={casquetteIcon} alt="card" />
            </div>
            <h6 className="main__card--title">Des accessoires très sympas</h6>
            <p className="main__card--text">De la casquette au célèbre &quot;canard en plastique&quot; !</p>
          </Link>
          <Link to="/articles/category/vetements" className="main__card">
            <div className="main__card--wrap">
              <img className="main__card--img" src={tshirt} alt="card" />
            </div>
            <h6 className="main__card--title">Des vêtements d&apos;une communauté</h6>
            <p className="main__card--text">Que tu souhaites rejoindre ou dont tu fais déjà partie</p>
          </Link>
        </div>
        {/* Cards section closed */}
      </div>
      {/* Container closed */}

    </main>
  );
}

export default Homepage;
