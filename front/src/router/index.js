import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';

let baseUrl;
window.$ = require('jquery');
window.jQuery = require('jquery');
window.dt = require('datatables.net');

baseUrl = 'http://laravel.test/api';

window.$.ajaxSetup({
  beforeSend: function (xhr, options) {
    options.url = baseUrl + options.url;
  }
});

Vue.use(VueRouter);

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  return Router;
}
