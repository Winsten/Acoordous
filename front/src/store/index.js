import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function ( /* { ssrContext } */ ) {
  const Store = new Vuex.Store({
    state: {
      BaseRouter: axios.defaults.baseURL,
      status: '',
      token: localStorage.getItem('token') || '',
      user: {},
      menu: '',
      empresa: {},
      timeoutnotification: null,
      arquivotipo: null,
      arquivosvisualizados: {}
    },
    mutations: {
      ArquivosVisualizados(visualizados) {
        arquivosvisualizados = visualizados
      },
      auth_request(state) {
        state.status = 'loading'
      },
      auth_success(state, token) {
        state.status = 'success'
        state.token = token
      },
      auth_error(state) {
        state.status = 'error'
      },
      logout(state) {
        state.status = ''
        state.token = ''
      },
      AuthUser(state, user) {
        state.user = user
      },
      ClienteMenu(state, menu) {
        state.menu = menu
      },
      Empresa(state, empresa) {
        state.empresa = empresa
      },
      Timeoutnotification(state, timeoutnotification) {
        state.timeoutnotification = timeoutnotification
      },

      ArquivoTipo(state, arquivotipo) {
        state.arquivotipo = arquivotipo
      },
    },
    getters: {
      isLoggedIn: state => !!state.token,
      authStatus: state => state.status,
      BaseRouter: state => state.BaseRouter,
      authUser: state => state.user,
      clienteMenu: state => state.menu,
      empresa: state => state.empresa,
      timeoutnotification: state => state.timeoutnotification,
      arquivotipo: state => state.arquivotipo,
    },
    actions: {
      login({
        commit
      }, user) {
        let app = this;
        return new Promise((resolve, reject) => {
          commit('auth_request')
          axios({
              url: user.rota,
              data: user,
              method: 'POST'
            })
            .then(resp => {
              const token = resp.data.token
              const user = resp.data.user
              localStorage.setItem('token', token)
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
              commit('auth_success', token)
              commit('AuthUser', user)
              commit('ClienteMenu', resp.data.admin)

              resolve(resp)
            })
            .catch(err => {
              commit('auth_error')
              localStorage.removeItem('token')
              reject(err)
            })
        })
      },
      logout({
        commit
      }) {
        return new Promise((resolve, reject) => {
          commit('logout')

          axios({
              url: '/auth/logout',
              method: 'POST'
            })
            .then(resp => {
              localStorage.removeItem('token')
              delete axios.defaults.headers.common['Authorization']
              resolve()

            })
            .catch(err => {
              commit('auth_error')
              localStorage.removeItem('token')
              reject(err)
            })
        })
      }
      // register({
      //   commit
      // }, user) {
      //   return new Promise((resolve, reject) => {
      //     commit('auth_request')
      //     axios({
      //         url: '/auth/register',
      //         data: user,
      //         method: 'POST'
      //       })
      //       .then(resp => {
      //         const token = resp.data.token
      //         const user = resp.data.user
      //         localStorage.setItem('token', token)
      //         axios.defaults.headers.common['Authorization'] = token
      //         commit('auth_success', token)
      //         resolve(resp)
      //       })
      //       .catch(err => {
      //         commit('auth_error', err)
      //         localStorage.removeItem('token')
      //         reject(err)
      //       })
      //   })
      // },
    },
    // // enable strict mode (adds overhead!)
    // // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
