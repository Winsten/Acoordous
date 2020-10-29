import Vue from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://laravel.test/api';
Vue.prototype.$axios = axios;
