/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import './styles.scss';
import mailIcon from '../../assets/images/Footer/mailIcon.png';
import facebookIcon from '../../assets/images/Footer/facebookIcon.png';
import twitterIcon from '../../assets/images/Footer/twitterIcon.png';
import { Modal } from 'react-bootstrap';

function Footer() {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <footer className="footer">
      <section className="footer__contact">
        <p className="footer__contact-title">Nous contacter</p>
          <img className="footer__icon" src={mailIcon} alt="" />
          <img className="footer__icon" src={facebookIcon} alt="" />
          <img className="footer__icon" src={twitterIcon} alt="" />
      </section>
      <section className="footer__links">
        <a href="#" className="footer__links-item" onClick={() => setShowModal(true)}>Mention légales</a>
        <Modal className='modal' show={showModal} onHide={handleCloseModal}>
          <Modal.Body className='modal__body'>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste dignissimos dolor corporis exercitationem voluptas doloremque eveniet dolorem repellendus sint! Odio est repellat beatae quo nobis fuga nulla quae a vero!</h1>
          </Modal.Body>
        </Modal>
        <a href="#" className="footer__links-item">O&apos;shop</a>
      </section>
    </footer>
  );
}

export default Footer;
