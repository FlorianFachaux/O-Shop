import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IArticle } from "../../../@types/article";
import { Modal } from 'react-bootstrap';
import '../styles.scss';
import axiosInstance from "../../../utils/axios";

interface EditArticleProps {
  articleId: number;
}

function EditArticle({ articleId }: EditArticleProps) {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<IArticle | undefined>();
  const [editedArticle, setEditedArticle] = useState<IArticle | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleResponse = await axiosInstance.get(`/articles/${id}`);
        setDetail(articleResponse.data);
        setEditedArticle(articleResponse.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchArticle();
  }, [id]);

  const handleOpenEditModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditData = async () => {
    try {
      const response = await axiosInstance.patch(
        `/articles/${id}`,
        editedArticle
      );

      if (response.status === 200) {
        // Update local state with the edited data
        setDetail(editedArticle);

        // Close the modal
        handleCloseModal();
      } else {
        console.error("Failed to update article.");
      }
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditedArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  return (
    <section className="edit-article">
      <button onClick={handleOpenEditModal} className="edit__button">
        Modifier
      </button>
      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header className="modal__header" closeButton>
          <Modal.Title>Modifier l'article</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal__body">
          {editedArticle ? (
            <>
              <label className="modal__label">Nom de l'article:</label>
              <input
                type="text"
                name="article_name"
                value={editedArticle.article_name}
                onChange={handleInputChange}
              />

              <label className="modal__label">Extrait:</label>
              <input
                type="text"
                name="excerpt"
                value={editedArticle.excerpt}
                onChange={handleInputChange}
              />

              <label className="modal__label">Description:</label>
              <textarea
                name="description"
                value={editedArticle.description}
                onChange={handleInputChange}
              />

              <label className="modal__label">Image (url):</label>
              <input
                type="text"
                name="image"
                value={editedArticle.image}
                onChange={handleInputChange}
              />

              <label className="modal__label">Prix:</label>
              <input
                type="number"
                name="price"
                value={editedArticle.price}
                onChange={handleInputChange}
              />

              {/* Add more input fields for other properties */}
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="modal__footer">
          <button className="modal__button" onClick={handleCloseModal}>
            Annuler
          </button>
          <button className="modal__button" onClick={handleEditData}>
            Enregistrer
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default EditArticle;