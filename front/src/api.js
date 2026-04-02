import axios from 'axios';

const API = axios.create({
  baseURL: 'https://studentsponsorship.onrender.com/api'
});

export default API;