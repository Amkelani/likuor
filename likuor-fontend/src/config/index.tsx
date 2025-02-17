import {ENDPOINTS} from './endpoints';

const DEBUG = true;
const BASE_URL = 'http://192.168.0.104:8000/';
// const BASE_URL = 'https://dine-hub.rn-admin.site/';
const AUTHORIZATION_TOKEN = 'aH3KCew1YsWhWqW0tqNU3ndzHb3RdblI';

const CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Bearer ' + AUTHORIZATION_TOKEN,
  },
};

export {BASE_URL, AUTHORIZATION_TOKEN, ENDPOINTS, CONFIG, DEBUG};
