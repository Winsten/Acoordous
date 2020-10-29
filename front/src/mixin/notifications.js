export default {
  methods: {
    notif_notice(dados) {

      this.$q.notify({
        color: "primary",
        textColor: "white",
        message: "Aviso: " + dados['message'],
        avatar: dados['avatar'],
        position: dados['position'],
        icon: "fas fa-comment",
        actions: [{
          icon: "fas fa-times",
          color: "white"
        }]
      });
    },
    notif_sucess(dados) {

      this.$q.notify({
        color: "positive",
        textColor: "white",
        message: "Sucesso: " + dados['message'],
        avatar: dados['avatar'],
        position: dados['position'],
        icon: "fas fa-check-circle",
        actions: [{
          icon: "fas fa-times",
          color: "white"
        }]
      });
    },
    notif_danger(dados) {

      this.$q.notify({
        color: "negative",
        textColor: "white",
        message: "Erro: " + dados['message'],
        avatar: dados['avatar'],
        position: dados['position'],
        icon: "fas fa-exclamation-triangle",
        actions: [{
          icon: "fas fa-times",
          color: "white"
        }]
      });
    },
    notif_warning(dados) {

      this.$q.notify({
        color: "warning",
        textColor: "dark",
        message: "Atenção: " + dados['message'],
        avatar: dados['avatar'],
        position: dados['position'],
        icon: "fas fa-bell",
        actions: [{
          icon: "fas fa-times",
          color: "dark"
        }]
      });
    }
  }
}
