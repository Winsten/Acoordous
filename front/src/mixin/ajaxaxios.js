import notifications from "app/src/mixin/notifications.js";
export default {
  mixins: [notifications],
  methods: {
    routerfalls(status, rota401redirect = '/logout') {
      if (status == 403) {
        self.notif_danger({
          message: "Você não tem permissão para acessar esta página tente outra."
        });
        setTimeout(function () {
          window.history.back();
          return 'acesso negado';
        }, 3000);
      }

      if (status == 401) {
        self.notif_danger({
          message: "Seu token de acesso expirou, favor entrar no sistema novamente."
        });
        setTimeout(function () {
          window.location.replace(rota401redirect);
          return 'acesso negado';
        }, 3000);
      }


    },
    async errorssystem(error, rota401redirect = "/logout") {
      let self = this;
      error = error.response;
      // é obrigadorio fazer o error receber o error.response pois se não não consegue pegar o erro corretamente e dá uma string nada a ver
      $('input').not(":file").each(function () {
        $(this).click();
      });
      if (error.status == 401) {
        self.notif_danger({
          message: "Seu token de acesso expirou, favor entrar no sistema novamente."
        });
        window.location.replace(rota401redirect);
        return
      }

      if (error.status == 422 || error.status == '422') {
        // entra aqui em caso de erro de validação de campos do laravel e no form padrão os erros são tratados e exibidos ao cliente
        self.notif_danger({
          message: "Campos inválidos, verifique todos os campos e tente novamente"
        });


      } else {

        if (error.data.message != undefined && error.data.status != undefined && error.data.title != undefined) {
          self.notif_danger({
            message: error.data.message
          });
          this.routerfalls(error.status, rota401redirect);


        } else {

          if (error.data.message == undefined || error.data.message == "undefined") {
            self.notif_danger({
              message: "Algum erro inesperado ocorreu recarregue a página e tente novamente"
            });
          } else {
            if (error.data.message == 'acesso negado') {
              self.notif_danger({
                message: "Você ñão tem permissão para poder efetuar a tarefa, verifique com o administrador"
              });
            } else {
              self.notif_danger({
                message: "Erro de processamento, aguarde alguns segundos e tente novamente! ou recarregue a página."
              });
            }
          }
        }
      }
      return error;
    },
    async sucesssystem(response) {
      let self = this;
      if (response.data.message != undefined && response.data.status != undefined && response.data.title != undefined) {

        self.notif_sucess({
          message: response.data.message
        });

      } else {

        self.notif_sucess({
          message: "Dados atualizados com sucesso"
        });
      }
      return response;

    },
    async axiospost(caminho, campos, validacao = true, rota401redirect = '/logout', mensagem = true) {
      let self = this;
      self.$q.loading.show();
      let resposta = await this.$axios.post(caminho, campos).then(response => {
        return [response, true];
      }).catch(error => {
        return [error, false];
      });
      self.$q.loading.hide();

      if (resposta[1]) {
        if (mensagem) {
          self.sucesssystem(resposta[0]);
        }
      } else {
        self.errorssystem(resposta[0]);
      }
      self.$q.loading.hide();

      return resposta[0];
    },
    async axiosput(caminho, campos, rota401redirect = '/logout') {
      let self = this;
      campos.append("_method", "put");
      self.$q.loading.show();

      let resposta = this.$axios
        .post(caminho, campos)
        .then(response => {
          response = self.sucesssystem(response);
          self.$q.loading.hide();
          return response;

        }).catch(error => {
          error = self.errorssystem(error);
          self.$q.loading.hide();
          return error;
        });
      return resposta;
    },
    axiosget(caminho, rota401redirect = '/logout') {
      let self = this;
      self.$q.loading.show();

      let resposta = this.$axios
        .get(caminho).then(response => {
          self.$q.loading.hide();
          return response;
        }).catch(error => {
          error = this.errorssystem(error);
          self.$q.loading.hide();
          return error;
        });
      return resposta;
    },
    buscacep(cep) {
      let self = this;
      if (cep == '' || cep.length < 9) {
        self.notif_danger({
          message: "Cep Inválido tente outro"
        });
        return 'erro';
      }

      self.$q.loading.show();

      var campos = {
        id: cep
      };
      let resposta = this.$axios
        .post('buscar/cep', campos)
        .then(response => {

          self.$q.loading.hide();
          return response;
        }).catch(error => {

          error = this.errorssystem(error);
          self.$q.loading.hide();
          return error;

        });

      return resposta;
    },
    async axiosdeletedirect(id, caminho, texto = null, rota401redirect = '/logout') {
      let self = this;
      self.$q.loading.show();

      let resposta = this.$axios.delete(caminho + id).then(response => {
        self.notif_sucess({
          message: "Deletado com sucesso"
        });
        self.$q.loading.hide();

        $('#users-table').DataTable().ajax.reload();
        return true;

      }).catch(error => {
        error = this.errorssystem(error);
        self.$q.loading.hide();
        return error;
      });
      return resposta;

    },
    async axiosdelete(id, caminho, texto = null) {
      if (texto == null) {
        texto = id;
      }

      await this.$q.dialog({
        title: 'Deseja deletar o registro',
        message: "Tem certeza que deseja deletar o registro " + texto,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Sim',
          push: true,
          color: 'positive'
        },
        cancel: {
          label: 'Não',
          push: true,
          color: 'negative'
        },
      }).onOk(() => {
        let resposta = this.axiosdeletedirect(id, caminho);
        return resposta;
      })
    },


    async axiosrestore(id, caminho, texto = null) {
      let self = this;
      if (texto == null) {
        texto = id;
      }
      self.$q.dialog({
        title: 'Deseja restaurar o registro?',
        message: 'Tem certeza que deseja restaurar o registro ' + texto,
        cancel: true,
        ok: {
          label: 'Sim',
          push: true,
          color: 'positive'
        },
        cancel: {
          label: 'Não',
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        self.$q.loading.show();
        let resposta = this.$axios.post(caminho + '/' + id).then(response => {
          self.notif_sucess({
            message: "Restaurado com sucesso"
          });
          self.$q.loading.hide();
          $('#users-table').DataTable().ajax.reload();
          return true;

        }).catch(error => {
          error = this.errorssystem(error);
          self.$q.loading.hide();
          return error;

        });
        return resposta;

      }).onCancel(() => {
        self.$q.loading.hide();
      })
    }
  }
}
