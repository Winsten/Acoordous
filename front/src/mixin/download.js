import ajaxaxios from "app/src/mixin/ajaxaxios.js";
  export default {
    mixins: [ajaxaxios],
    methods: {
      async download_arquivo(rota, tipo, nome = null) {
        let self = this;
        self.$q.loading.show();

        self.$http.get(rota, {
            responseType: 'blob',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/' + tipo
            }
          })
          .then(response => {

            let newBlob = new Blob([response.data], {
              type: "application/" + tipo
            })
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(newBlob);
              return;
            }

            let data = window.URL.createObjectURL(newBlob);
            let link = document.createElement('a');
            link.href = data;
            if (nome == null) {
              link.download = response.headers.nome;

            } else {
              link.download = nome;

            }
            document.body.appendChild(link);
            link.click();
            setTimeout(function () {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(data);
              link.remove();
            }, 200);
            self.$q.loading.hide();


          }).catch(resp => {
            // self.$swal({
            //   title: "Erro no processamento",
            //   text: "Favor atualizar a página e tentar novamente",
            //   type: "error"
            // });
            self.$q.loading.hide();

          })
      }
    }
  }
