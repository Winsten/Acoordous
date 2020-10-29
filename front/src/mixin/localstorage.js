import localforage from 'localforage';
import {
  date
} from "quasar";
export default {
  mixins: [localforage],
  methods: {
    addLocalStorage(key, item) {
      let datahora = Date.now();
      // tempo de cache do localstorage
      datahora = date.addToDate(datahora, {
        hours: 1
      });
      //  adiciona o item + a data e hora de registro.
      item = [item, datahora];
      let dados = localforage.setItem(key, item).then(function (value) {
        dados = value;
      }).catch(function (err) {
        dados = false;
      });
      return dados
    },
    removeLocalStorage(key) {
      localforage.removeItem(key)
    },
    getLocalStorage(key) {
      let self = this;
      let dados = localforage.getItem(key).then(function (value) {

        let datahoraatual = Date.now();
        datahoraatual = date.addToDate(datahoraatual, {
          seconds: 1
        })
        // compara a data atual com a data do item guardado em memória.
        // remove do cache "localstorage" caso o tempo tenha passado e retorna false para o sistema baixar novamente
        if (datahoraatual > value[1]) {
          self.removeLocalStorage(key);
          return {
            retorno: false,
            itens: false
          };
        } else {
          if (value == null) {
            // se não encontrar nada no cache "localstorage" retorna falso
            return {
              retorno: false,
              itens: false
            };
          } else {
            // caso encontre a key no cache "localstorage" retorna true + o item

            return {
              retorno: true,
              itens: value[0]
            };
          }
        }
      }).catch(function (err) {
        return {
          retorno: false,
          itens: false
        };
      });
      return dados
    },
  }
}
