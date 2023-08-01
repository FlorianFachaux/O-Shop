/* eslint-disable import/prefer-default-export */
import axios from 'axios';

// Créer une instance d'axios me permettant d'enregistrer une configuration de base
const axiosInstance = axios.create({
  baseURL: 'https://o-shop-back.onrender.com/',
});

export default axiosInstance;
