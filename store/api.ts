import { API_URL } from '@env';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 필요 시
});

export default api;
