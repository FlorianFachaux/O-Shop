import React, { useEffect, useState } from "react";
import AddArticle from "./AddArticle";
import axios from "axios";
import { IArticle, User } from "../../@types/article";
import EditArticle from "./EditArticle";
import DeleteArticle from "./DeleteArticle";
import axiosInstance from "../../utils/axios";
import Cookies from "js-cookie";

function Backoffice() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<IArticle[]>([]);

  const fetchUser = async () => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        setError("Vous devez être connecté pour accéder à cette page.");
        return;
      }

      const response = await axiosInstance.get("/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;
      setUser(userData);
      setIsAdmin(userData.userConnected.isAdmin);
    } catch (error) {
      setError("Une erreur s'est produite lors de la récupération des données utilisateur.");
    }
  };

  const fetchArticles = async () => {
    try {
      const articlesResponse = await axiosInstance.get("/articles");
      setArticles(articlesResponse.data);
      setIsLoading(false);
    } catch (error) {
      setError("Erreur lors de la récupération des articles.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchArticles();
  }, []);

  return (
    <main className="backoffice">
      {error ? (
        <h2 className="message__error">{error}</h2>
      ) : isLoading ? (
        <h2>Loading...</h2>
      ) : isAdmin ? (
        <>
          <section className="add">
            <AddArticle />
          </section>
          <section className="edit">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom de l'article</th>
                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>{article.id}</td>
                    <td>{article.article_name}</td>
                    <td>
                      {article.id !== undefined && <EditArticle articleId={article.id} />}
                    </td>
                    <td>
                    {article.id !== undefined && <DeleteArticle articleId={article.id} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <h2 className="message__access-denied">
          Accès non autorisé. Vous devez être administrateur pour accéder à cette page.
        </h2>
      )}
    </main>
  );
}

export default Backoffice;