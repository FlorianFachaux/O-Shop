/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import './styles.scss';
import whiteLogo from '../../../assets/images/Footer/logo-yellow.png';
import mailIcon from '../../../assets/images/Footer/mailIcon.png';
import facebookIcon from '../../../assets/images/Footer/facebookIcon.png';
import twitterIcon from '../../../assets/images/Footer/twitterIcon.png';
import { Modal } from 'react-bootstrap';

function Footer() {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className="footerContainer">
      <img className="logo" src={whiteLogo} alt="" />
      <div className="textAndIcons">
        <div className="text">
          <p>Nous contacter:</p>
        </div>
        <div className="iconsContainer">
          <img className="icon mailIcon" src={mailIcon} alt="" />
          <img className="icon facebookIcon" src={facebookIcon} alt="" />
          <img className="icon twitterIcon" src={twitterIcon} alt="" />
        </div>
      </div>

      <ul>
        <li className="mentionList">
        <a href="#" className='cgv' onClick={() => setShowModal(true)}>Mention légales</a>
        </li>
        <Modal className='modal' show={showModal} onHide={handleCloseModal}>
          <Modal.Body className='modal__body'>
            <h1>Laury ipsum dolor sit amet consectetur adipisicing elit. Iste dignissimos dolor corporis exercitationem voluptas doloremque eveniet dolorem repellendus sint! Odio est repellat beatae quo nobis fuga nulla quae a vero!</h1>
          </Modal.Body>
        </Modal>
        <li className="mentionList">
          <a href="#">O&apos;shop</a>
        </li>
      </ul>
    </div>
  );
}

export default Footer;
