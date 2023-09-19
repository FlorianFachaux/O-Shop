/* eslint-disable import/prefer-default-export */
import axios from 'axios';

// Création d'une instance d'axios pour couvrir le projet
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

export default axiosInstance;
