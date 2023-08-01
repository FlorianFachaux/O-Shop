import './styles.scss';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useContext, FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faFaceSmile,
  faCalendarDays,
  faLock,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../context/Context';
import paiementSchema from '../../utils/paiementSchema';
import { IArticle } from '../../@types/article';
import { Modal } from 'react-bootstrap';

interface PaiementFormValues {
  lastName: string;
  cardNumbers: number;
  expiryDate: string;
  secretCode: number;
  termsAccepted: boolean;
}

const onSubmit = () => {
  console.log('submitted');
};

function Checkout() {
  const {
    values,
    errors,
    touched,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      lastName: '',
      cardNumbers: '',
      expiryDate: '',
      secretCode: '',
      termsAccepted: false, // initial value for the checkbox
    },
    validationSchema: paiementSchema,
    onSubmit,
    validateOnMount: true, // This will validate form on first render
  });

  // here we use cartcontext to dynamically modify the summary of the items to be purchased
  const { state } = useContext(CartContext);
  const { resetCart } = useContext(CartContext);

  // We use a forEach to calculate the sum of all articles prices
  let totalPrice = 0;
  state.forEach((article: IArticle) => {
    totalPrice += article.price! * article.quantity!;
  });

  let totalQuantity = 0;
  state.forEach((article: IArticle) => {
    totalQuantity += article.quantity!;
  });
  const [userLastName, setUserLastName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [hidePaiementContainer, setHidePaiementContainer] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Here we want to display the waiting modal during a few seconds
  const sleepTime = (ms: number) =>
    // We use resolve to indicate that promise is done
    new Promise((resolve) => setTimeout(resolve, ms));

  const navigate = useNavigate();

  // We look to the connected user's address and name
  const fetchData = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserAddress(response.data.userConnected.address);
      setUserLastName(response.data.userConnected.lastname);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();

  // This function is used to display the waiting modal
  const handleSubmit2 = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowWaitingModal(true);

    await sleepTime(3000); // time during which the code wait

    setShowWaitingModal(false);
    setHidePaiementContainer(true);
    setShowSuccessModal(true);

    // after a delay of 4s, we'll be redirected to homePage
    await sleepTime(4000);
    resetCart();
    return navigate('/');
  };

  const combinedHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValid) {
      handleSubmit(event); // Pass the event to Formik's handleSubmit
      handleSubmit2(event);
    }
  };
  // On gère la fermeture de la modal des CGV
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className="checkout">
      <h1 className="checkout__title">O&apos;Shop</h1>
      <h3 className="checkout__subtitle">Paiement</h3>
      {/* Here we find a table that summarizes the different articles that we
      have put in the cart */}
      <table className="checkout__table">
        <thead>
          <tr>
            <th>Vos articles</th>
            <th>Quantité</th>
            <th>Prix TTC</th>
          </tr>
        </thead>
        <tbody>
          {state.map((article: IArticle) => (
            <tr key={article.id}>
              <td>{article.article_name}</td>
              <td>{article.quantity}</td>
              <td>{`${article.price! * article.quantity!} €`}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td>{`Total des articles : ${state.length}`}</td>
            <td>{`${totalQuantity}`}</td>
            <td>{`Prix total : ${totalPrice} €  TTC`}</td>
          </tr>
        </tfoot>
      </table>
      <div className="checkout__userAddress">
        <p>Adresse de livraison :</p>
        <p>{userAddress}</p>
        <p>
          <input type="checkbox" />
          &nbsp;Utiliser cette adresse pour l&apos;adresse de facturation
        </p>
      </div>
      <div
        className={
          showSuccessModal
            ? 'checkout__success-modal--isVisible'
            : 'checkout__success-modal--isHidden'
        }
      >
        <div className="checkout__success-modal--success-card">
          <div>
            <p>
              {`Chèr.e Madame, Monsieur ${userLastName}, nous avons le plaisir
              de vous informer que la commande d'un montant de
              ${totalPrice}€ a bien été effectuée.`}
            </p>
          </div>

          <div className="checkout__success-modal--success-textAndIcon ">
            <p>
              success
              <span className="fontAwesome-successIcon">
                <FontAwesomeIcon icon={faCheck} />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div
        className={`form-container ${
          hidePaiementContainer
            ? 'checkout__Paiement-container--isHidden'
            : 'checkout__Paiement-container--isVisible'
        }`}
      >
        <form
          className="checkout__paiment-form"
          onSubmit={combinedHandleSubmit}
        >
          <h3>Terminal de paiement</h3>
          <div className="holderAndCardNumber">
            <div className="holder">
              <p>&nbsp;&nbsp;&nbsp;Titulaire :</p>
              <span>
                <FontAwesomeIcon icon={faFaceSmile} />
              </span>
              <input
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`checkout__paiment-form--input${
                  errors.lastName && touched.lastName ? ' input-error' : ''
                }`}
                type="text"
                placeholder="Nom Prénom"
              />
              {errors.lastName && touched.lastName && (
                <p className="error-message">{errors.lastName}</p>
              )}
            </div>
            <div className="cardNumber">
              <p>&nbsp;&nbsp;&nbsp;Numéro de carte :</p>
              <span>
                <FontAwesomeIcon icon={faCreditCard} />
              </span>
              <input
                name="cardNumbers"
                value={values.cardNumbers}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`checkout__paiment-form--input${
                  errors.cardNumbers && touched.cardNumbers
                    ? ' input-error'
                    : ''
                }`}
                type="number"
                placeholder="Card numbers"
              />
              {errors.cardNumbers && touched.cardNumbers && (
                <p className="error-message">{errors.cardNumbers}</p>
              )}
            </div>
          </div>
          <div className="expiryAndCVC">
            <div className="expiry">
              <p>&nbsp;&nbsp;Expire le :</p>
              <span>
                <FontAwesomeIcon icon={faCalendarDays} />
              </span>
              <input
                name="expiryDate"
                value={values.expiryDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`checkout__paiment-form--input${
                  errors.expiryDate && touched.expiryDate ? ' input-error' : ''
                }`}
                type="text"
                placeholder="00/00"
              />
              {errors.expiryDate && touched.expiryDate && (
                <p className="error-message">{errors.expiryDate}</p>
              )}
            </div>
            <div className="expiry">
              <p>&nbsp;&nbsp;CVC :</p>
              <span>
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                name="secretCode"
                value={values.secretCode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`checkout__paiment-form--input${
                  errors.secretCode && touched.secretCode ? ' input-error' : ''
                }`}
                type="number"
                placeholder="000"
              />
              {errors.secretCode && touched.secretCode && (
                <p className="error-message">{errors.secretCode}</p>
              )}
            </div>
          </div>
          <span>
            <div>
              <input
                type="checkbox"
                id="paymentCheckbox"
                name="termsAccepted"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.termsAccepted}
              />
              <label htmlFor="paymentCheckbox">
                &nbsp;J&apos;accepte les <a href="#" className='cgv' onClick={() => setShowModal(true)}>conditions générales de vente.</a>
              </label>
              <Modal className='modal' show={showModal} onHide={handleCloseModal}>
                <Modal.Body className='modal__body'>

                <h1 className='modal__body--title'>CONDITIONS  GENERALES POUR VENTE DE MARCHANDISES</h1>

                <h3 className='modal__body--subtitle'>Article 1.</h3> 

                Sauf dispositions légales impératives contraires, les présentes conditions générales s’appliquent à toutes les activités de la SOCIETE. Les présentes conditions générales, de même que toutes conditions particulières de la SOCIETE, sont réputées acceptées par ses acheteurs et ses fournisseurs, même si elles seraient en contradiction avec leurs propres conditions générales ou particulières. Toutes dérogations aux présentes conditions devront être constatées par écrit et notifiées par une personne habilitée à engager la SOCIETE. 

                <h3 className='modal__body--subtitle'>Article 2.</h3>  

                Les offres de la SOCIETE sont faites sans engagement. Les commandes ne sont définitives qu’après avoir été confirmées par écrit et signées par une personne habilitée à engager la SOCIETE. La SOCIETE est dégagée de toute responsabilité en cas d’inexécution due à un cas de force majeure, une grève, un lock-out, etc.

                <h3 className='modal__body--subtitle'>Article 3.</h3>

                Les délais de livraison sont donnés à titre indicatif. Les marchandises voyagent aux risques et périls de l’acheteur, le transfert des risques opérant dès que la marchandise quitte les entrepôts de la SOCIETE. La SOCIETE se réserve le droit de facturer les marchandises au fur et à mesure des livraisons, même si celles-ci sont partielles.   

                <h3 className='modal__body--subtitle'>Article 4. </h3>

                Les marchandises vendues par la SOCIETE sont garanties par le fabricant contre tous défauts de fabrication. La SOCIETE est uniquement responsable des vices cachés sauf si elle démontre le caractère indécelable du vice. La garantie de la SOCIETE cesse si l’acheteur ne lui a pas fait part de ses griefs par lettre recommandée au plus tard dans le mois de la vente. La responsabilité de la SOCIETE est limitée au remplacement de la pièce défectueuse sans qu’elle puisse être tenue à aucun remboursement, indemnité ou dommages et intérêts de quelque nature et pour quelque motif que ce soit. 

                <h3 className='modal__body--subtitle'>Article 5.</h3> 

                Sauf convention contraire et écrite, toutes les factures de la SOCIETE sont payables au comptant au domicile de la SOCIETE. Le défaut de paiement d’une facture à l’échéance, rend immédiatement exigibles toutes les sommes dues, quelles que soient les facilités de paiement préalablement accordées. A défaut de paiement à l’échéance d’une fourniture partielle, la SOCIETE se réserve le droit d’annuler le solde de la commande. 

                <h3 className='modal__body--subtitle'>Article 6. </h3>

                A défaut de paiement d’une facture à son échéance et sans mise en demeure préalable, le débiteur se reconnaît tenu au paiement d’une indemnité fixée à 15% du montant de la facture dû avec un minimum de 150,00 € et d’un intérêt au taux fixé par la loi du 02.08.2002 relative à la lutte contre les retards de paiements dans les transactions commerciales. 


                <h3 className='modal__body--subtitle'>Article 7.</h3>

                L’acheteur reconnaît que les biens restent la propriété de la SOCIETE et ce jusqu’au paiement intégral de la facture ainsi que de ses accessoires en cas de non-paiement à la date d’échéance.


                <h3 className='modal__body--subtitle'>Article 8.</h3>

                L’envoi de la facture reprenant le solde final vaut demande de réception si celle-ci n’a pas été réalisée antérieurement. A défaut de réclamation par lettre recommandée dans les vingt jours à dater de la facturation, les travaux seront considérés comme réceptionnés de manière définitive et sans réserve.

                <h3 className='modal__body--subtitle'> Article 9.</h3>

                En cas de litige, autre que le recouvrement de factures impayées, les parties s’engagent à préalablement recourir à une médiation en désignant un  médiateur agrée et à participer à deux séances de deux heures minimum aux fins de tenter de trouver une solution amiable.

                <h3 className='modal__body--subtitle'> Article 10.</h3>

                Tous les litiges seront de la compétence exclusive des juridictions de l’arrondissement judiciaire de Bruxelles, même en cas d’appel à garantie ou de pluralité de défendeurs. La SOCIETE se réserve toutefois le droit de citer devant le Juge du siège du ou de l’un des défendeurs. Aucun mode de paiement ou d’exécution n’apportera novation ou dérogation à la présente clause expresse d’attribution exclusive de compétence. Le droit belge sera seul applicable. 
               
                </Modal.Body>
              </Modal>
              {errors.termsAccepted && touched.termsAccepted && (
                <p className="error-message__checkbox">
                  {errors.termsAccepted}
                </p>
              )}
            </div>
          </span>

          <button type="submit" id="paymentSubmit">
            Payer
          </button>
        </form>
      </div>
      <div
        // we create a class that will or will not be displayed depending on the state
        className={`checkout__waiting-modal ${
          showWaitingModal
            ? 'checkout__waiting-modal--isVisible'
            : 'checkout__waiting-modal--isHidden'
        }`}
      >
        <div className="spinner" />
      </div>
    </div>
  );
}

export default Checkout;
