/* eslint-disable jsx-a11y/anchor-is-valid */
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from '../../assets/images/profile.png';
import './styles.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../@types/article';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp, faAt, faBoxOpen, faCreditCard, faPhone } from '@fortawesome/free-solid-svg-icons';

interface AccountProps {
  handleLogout: () => void;
}
function Account({ handleLogout }: AccountProps) {
  const navigate = useNavigate();
  // Etat de l'affichage de la modal
  const [showModal, setShowModal] = useState(false);
  // On récupère l'état des données personnelles du profil
  const [user, setUser] = useState<User | undefined>();
  const [userFirstname, setUserFirstname] = useState('');
  const [userLastname, setUserLastname] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPromo, setUserPromo] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPhone, setUserPhone] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('https://o-shop-back.onrender.com/account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data.userConnected;
        setUser(userData);
        setUserFirstname(userData.firstname);
        setUserLastname(userData.lastname);
        setUserAddress(userData.address);
        setUserPromo(userData.promo);
        setUserEmail(userData.email);
        setUserPhone(userData.phone);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  // Fermeture de la modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditData = async () => {
    try {
      const token = localStorage.getItem('token');

      const userData = {
        firstname: userFirstname,
        lastname: userLastname,
        address: userAddress,
        promo: userPromo,
        phone: userPhone,
      };
      // On effectue la requête patch pour l'envoi des données à la base de données
      await axios.patch('https://o-shop-back.onrender.com/account', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(userData);

      handleCloseModal();

    } catch (error) {
      console.error(error);
    }
  };

  
  // Modal de suppression de compte
  const handleDeleteAccount = () => {
    setShowModal(false);
    setShowDeleteConfirmation(true);
  };
// Modal de confirmation de suppression de compte
  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // On envoi la requête DELETE qui supprimera les données du compte
      await axios.delete('http://localhost:3000/account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserFirstname('');
      setUserLastname('');
      setUserAddress('');
      setUserPromo('');
      setUserEmail('');
      setUserPhone('');
      setUserPassword('');
      setUserEmail('');
      
      localStorage.removeItem('token');
      handleLogout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="profile">
      <div className="profile__leftside">
        <img src={Profile} alt="profile" className="profile__picture" />
        <div id="infos">
          <div className="profile__name">
            {userFirstname} {userLastname}
          </div>
          <div className="profile__promoname">
            {userPromo}
          </div>
        </div>
        <div id="settings">
          <a className="profile__settings" href="#" onClick={() => setShowModal(true)}>Détails du compte</a>
          <a className="profile__orders" href="#">Mes commandes</a>
        </div>


        {/* Modal d'affichage des données du comptes et de modifications des données */}
        <Modal className='modal' show={showModal} onHide={handleCloseModal}>
        <Modal.Header className='modal__header' closeButton>
          <Modal.Title>Modifier mes informations</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal__body'>
          <form>
            <div className="modal__part">
              <label htmlFor="firstname">Prénom</label>
              <input
                type="text"
                className="modal__input"
                id="firstname"
                value={userFirstname}
                onChange={(e) => setUserFirstname(e.target.value)}
              />
            </div>
            <div className="modal__part">
              <label htmlFor="lastname">Nom</label>
              <input
                type="text"
                className="modal__input"
                id="lastname"
                value={userLastname}
                onChange={(e) => setUserLastname(e.target.value)}
              />
            </div>
            <div className="modal__part">
              <label htmlFor="address">Adresse</label>
              <input
                type="text"
                className="modal__input"
                id="address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
              />
            </div>
            <div className="modal__part">
              <label htmlFor="promo">Promo</label>
              <input
                type="text"
                className="modal__input"
                id="promo"
                value={userPromo}
                onChange={(e) => setUserPromo(e.target.value)}
              />
            </div>
            <div className="modal__part">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="modal__input"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="modal__part">
              <label htmlFor="phoneNumber">Téléphone</label>
              <input
                type="text"
                className="modal__input"
                id="phoneNumber"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className='modal__footer'>
          <button className='modal__button' onClick={handleEditData}>
            Enregistrer
          </button>
          <button className='modal__button' onClick={handleDeleteAccount}>
            Supprimer mon compte
          </button>
        </Modal.Footer>
      </Modal>



        {/* Modal de confirmation de suppression du compte */}
        <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation} className="modal">
        <Modal.Header closeButton className="modal__header">
          <Modal.Title className="modal__header--title">Confirmation ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal__body">
          Êtes-vous sûr de vouloir supprimer votre compte ?
        </Modal.Body>
        <Modal.Footer className="modal__footer">
          <button className="modal__button" onClick={handleCloseDeleteConfirmation}>
            Annuler
          </button>
          <button className="modal__button modal__button--delete" id='button__delete' onClick={confirmDeleteAccount}>
            Supprimer
          </button>
        </Modal.Footer>
      </Modal>
      </div>
      <div className="profile__rightside">
        <h2 className="profile__title">
          Mon Profil
        </h2>
        <div className="profile__lastOrder">
          <h4 className="profile__lastOrder--title">
            Ma dernière commande
          </h4>
          <p className='profile__lastOrder--message'>Aucune commande à afficher</p>
        </div>
        <div className="profile__faq">
          <h2 className="profile__faq--title">
            Questions ?
          </h2>
          <div className="profile__faq_items">
            <div className="profile__faq--item">
            <FontAwesomeIcon className='account-icons' icon={faBoxOpen} size="2xl" />
              <p className="profile__faq--item--title">
                Les commandes
              </p>
            </div>
            <div className="profile__faq--item">
              <FontAwesomeIcon className='account-icons' icon={faArrowCircleUp} size="2xl" />
              <p className="profile__faq--item--title">
                Les retours
              </p>
            </div>
            <div className="profile__faq--item">
            <FontAwesomeIcon className='account__icons' icon={faCreditCard} size="2xl" />
              <p className="profile__faq--item--title">
                Les paiements
              </p>
            </div>
          </div>
        </div>
        <div className="profile__contact">
          <h2 className="profile__contact--title">
            Contactez-nous:
          </h2>
          <div className="profile__contact_items">
            <div className="profile__contact--item">
            <FontAwesomeIcon className='account__icons' icon={faAt} size="2xl" />
              <p className="profile__contact--item--title">
                Par email
              </p>
            </div>
            <div className="profile__contact--item">
            <FontAwesomeIcon className='account__icons' icon={faPhone} size="2xl" />
              <p className="profile__contact--item--title">
                Par téléphone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;


