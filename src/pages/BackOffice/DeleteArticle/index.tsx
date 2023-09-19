import axios from "axios";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import axiosInstance from "../../../utils/axios";
import Cookies from "js-cookie";

interface DeleteArticleProps{
 articleId:number;
}

function DeleteArticle({ articleId }: DeleteArticleProps) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const handleDeleteArticle = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = Cookies.get('authToken');
  
      // On envoie la requête DELETE à la base de données
      await axiosInstance.delete(`/articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="delete">
      <button onClick={() => articleId !== undefined && handleDeleteArticle()} className="edit__button">
                  Supprimer
      </button>
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} className='modal'>
        <Modal.Header closeButton className='modal__header'>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal__body'>
          Êtes-vous sûr de vouloir supprimer cet article ?
        </Modal.Body>
        <Modal.Footer className='modal__footer'>
          <button className='modal__button' onClick={() => setShowConfirmationModal(false)}>
            Annuler
          </button>
          <button className='modal__button' onClick={handleConfirmDelete}>
            Supprimer
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default DeleteArticle;
