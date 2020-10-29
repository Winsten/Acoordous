<template>
  <div class="row q-pa-md">
    <div class="col-12 shadow-7">
      <div v-if="!cabecalos" class="col-12 flex-center text-center">
        <h5 class="text-blue">{{ title }}</h5>
        <hr />
      </div>
      <div v-if="cabecalos" class="col-12 q-pa-sm flex-center text-center">
        <h5 class="text-blue q-ma-sm">{{ title }}</h5>
        <hr />
        <q-btn color="primary" :to="rotacreate" class="q-ma-xs" label="Criar" />
        <q-btn
          color="red"
          v-if="!e_lixeira"
          :to="rotalixeira"
          class="q-ma-xs"
          label="lixeira"
        />
        <q-btn
          color="secondary"
          v-if="e_lixeira"
          :to="rotadata"
          class="q-ma-xs"
          label="Voltar"
        />
        <q-btn
          color="secondary"
          v-if="botaoexcel"
          class="q-ma-xs"
          @click="abrirexcel"
          label="Excel"
        />
        <q-btn
          color="cyan"
          v-if="botaocopiar && !e_lixeira"
          class="q-ma-xs"
          @click="copyline"
          label="Copiar Linha"
        />
        <slot name="botoes"></slot>
      </div>
      <div class="col-12" v-if="errorsresposta != null && errorsbag">
        <q-banner
          v-for="item in errorsresposta"
          v-bind:data="item"
          v-bind:key="item.text"
          class="text-white bg-red q-ma-xs"
        >
          <strong>{{ item[0] }}</strong>
        </q-banner>
      </div>
      <br />
      <div class="col-12 q-ma-sm flex-center text-center" v-if="excel">
        <q-separator />
        <h6 class="text-blue q-ma-sm">Exportar Excel</h6>
        <q-form class="q-pa-xs q-gutter-md">
          <q-input
            outlined
            @change="verificainicial"
            type="number"
            label="Cod. Inicial"
            v-model="inicial"
            hint="Digite o cod inicial 'para tudo digite 0 nos dois'"
          />
          <q-input
            outlined
            @change="verificainicial"
            type="number"
            label="Cod. Final"
            v-model="final"
            hint="Digite o cod final 'para tudo digite 0 nos dois'"
          />
          <q-btn
            color="negative"
            class="q-ma-md"
            @click="baixar"
            :label="linhas"
          />

          <q-separator />
          <h6 class="text-blue q-ma-sm">Importar Excel</h6>
          <q-btn
            color="warning"
            class="q-ma-md"
            @click="$refs.sendexcel.$el.click()"
            label="Importar arquivo"
          />

          <q-input
            @change="enviarexcel"
            type="file"
            style="display:none"
            ref="sendexcel"
            hint="Cuidado ao enviar!"
          />
        </q-form>
        <q-separator />
      </div>
      <div
        class="col-12 q-pa-sm no-shadow q-table__container q-table--horizontal-separator q-table__card q-table--dense q-table--no-wrap"
      >
        <div
          class="col-12 q-table flex-center text-center"
          id="tabledatatable"
          style="overflow: scroll; "
        ></div>
      </div>
    </div>
  </div>
</template>
<style>
@media only screen and (max-width: 510px) {
  .btnmargin {
    margin-top: 5px;
  }
}
</style>
<script>
import datatable from "app/src/mixin/table.js";
import ajaxaxios from "app/src/mixin/ajaxaxios.js";
import notifications from "app/src/mixin/notifications.js";
import download from "app/src/mixin/download.js";

export default {
  mixins: [datatable, ajaxaxios, notifications, download],
  props: {
    titulo: { type: String },
    rotabase: { type: String },
    tablerow: { type: String },
    cabecalos: { type: Boolean, default: true },
    tituloprefixo: { type: Boolean, default: true },
    avancado: { type: String, default: null },
    cols: { type: [Array, String] },
    campo_botao_copy_select: { type: String, default: "id" },
    importandexport: { type: Boolean, default: false },
    copiarlinha: { type: Boolean, default: false },
    nomeexcel: { type: String, default: "ArquivoExportado" }
  },
  data() {
    return {
      rotadata: this.rotabase,
      rotaenvioexcel: "/api" + this.rotabase + "excel/import",
      title: this.titulo,
      tr: this.tablerow,
      colunas: this.cols,
      routerbase: this.$store.getters.BaseRouter,
      nomeexcel2: this.nomeexcel,
      inicial: 0,
      final: 0,
      linhas: "Exportar tudo",
      errorsresposta: null,
      errorsbag: false,
      avancada: this.avancado,
      parametro: false,
      serverside: true,
      rotadatatable: "",
      rotacreate: this.rotabase + "create",
      rotalixeira: this.rotabase + "lixeira/lixeira",
      excel: false,
      botaoexcel: this.importandexport,
      botaocopiar: this.copiarlinha,
      campo_selecionado_datatable: this.campo_botao_copy_select,
      e_lixeira: false
    };
  },
  watch: {
    $route(to, from) {
      //update the variables with new route params
      this.changerouter();
    }
  },
  mounted() {
    // Edit record
    let self = this;
    if (process.env.DEV) {
      self.rotaenvioexcel = "/api" + self.rotabase + "excel/import";
    } else {
      self.rotaenvioexcel = "/api" + self.rotabase + "excel/import";
    }
    if (self.copiarlinha) {
      $(document).ready(function() {
        $("#users-table").on("click", "tbody tr", function() {
          if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
          } else {
            $("#users-table tr.selected").removeClass("selected");
            $(this).addClass("selected");
          }
        });
      });
    }

    self.createtabledatatable();
    $("#users-table thead").html(self.tr);
    $("#users-table tfoot").html(self.tr);

    self.datatablesbuttons();
    if (self.$route.params.lixeira != undefined) {
      self.rotadatatable =
        self.routerbase + self.rotadata + "datatable/lixeira";
      if (self.tituloprefixo) {
        self.title = "Lixeira " + self.titulo;
      } else {
        self.title = self.titulo;
      }
      self.e_lixeira = true;
    } else {
      self.rotadatatable = self.routerbase + self.rotadata + "datatable";
      if (self.tituloprefixo) {
        self.title = "Cadastro " + this.titulo;
      } else {
        self.title = this.titulo;
      }
      self.e_lixeira = false;
    }
    self.criardatatable(
      self.rotadatatable,
      self.colunas,
      self.parametro,
      self.avancada,
      self.serverside,
      localStorage.getItem("token")
    );
  },
  methods: {
    abrirexcel() {
      let self = this;
      if (self.excel) {
        self.excel = false;
      } else {
        self.excel = true;
      }
    },
    routerpush(local) {
      let self = this;
      self.$router.push(local);
    },
    datatablesbuttons() {
      let self = this;
      $("#users-table").on("click", "button.datatables_visualizar", function(
        e
      ) {
        let local = $(this).val();
        local = local.toString();
        self.routerpush(self.rotadata + local);
      });

      $("#users-table").on("click", "button.datatables_editar", function(e) {
        self.$router.push(self.rotadata + $(this).val() + "/edit");
      });

      $("#users-table").on("click", "button.datatables_deletar", function(e) {
        self.axiosdelete($(this).val(), self.rotadata);
      });

      $("#users-table").on("click", "button.datatables_restaurar", function(e) {
        self.axiosrestore($(this).val(), self.rotadata + "restaurar");
      });
    },
    async copyline() {
      let self = this;
      let datatableSelect = $("#users-table").DataTable();
      if (
        datatableSelect.row(".selected").index() == undefined ||
        datatableSelect.row(".selected").index() == "undefined"
      ) {
        let self = this;
        self.notif_warning({
          message: "Selecione um registro na tabela e tente novamente"
        });
      } else {
        let dataSelect = datatableSelect.rows(".selected").data()[0][
          self.campo_selecionado_datatable
        ];
        self.$router.push(self.rotadata + "copiar/linha/" + dataSelect);
      }
    },
    async createtabledatatable() {
      $("#tabledatatable").html(
        '<table class="stripe " id="users-table"> <thead> </thead> <tfoot> </tfoot> </table> <br> <br> '
      );
    },
    async recreatedatatable() {
      let self = this;
      $("#users-table")
        .DataTable()
        .destroy();
      $("#tabledatatable table").remove();
      await self.createtabledatatable();
      $("#users-table thead").html(self.tr);
      $("#users-table tfoot").html(self.tr);

      setTimeout(function() {
        self.criardatatable(
          self.rotadatatable,
          self.colunas,
          self.parametro,
          self.avancada,
          self.serverside,
          localStorage.getItem("token")
        );
      }, 400);
      self.datatablesbuttons();
    },
    async changerouter() {
      let self = this;
      if (self.$route.params.lixeira != undefined) {
        self.rotadatatable =
          self.routerbase + self.rotadata + "datatable/lixeira";
        self.recreatedatatable();
        self.title = "Lixeira " + this.titulo;
        self.botaoexcel = false;
        self.excel = false;
        self.e_lixeira = true;
      } else {
        self.rotadatatable = self.routerbase + self.rotadata + "datatable";
        self.recreatedatatable();
        self.title = "Cadastro " + this.titulo;
        self.e_lixeira = false;
        self.botaoexcel = true;
        self.excel = false;
      }
    },
    async comparacao() {
      let self = this;
      if (self.inicial == "") {
        self.inicial = 0;
      }
      if (self.final == "") {
        self.final = 0;
      }

      if (self.inicial != 0 || self.final != 0) {
        self.linhas = "Exportar por cod.";
      } else {
        self.linhas = "Exportar tudo";
      }
    },
    async verificainicial() {
      let self = this;
      self.comparacao();
    },
    verificafinal() {
      let self = this;
      self.comparacao();
      self.inicial = parseInt(self.inicial);
      self.final = parseInt(self.final);
      if (!Number.isInteger(self.inicial)) {
        self.notif_warning({
          message: "O campo inicial deve ser um número inteiro e positivo"
        });
        return false;
      }

      if (!Number.isInteger(self.final)) {
        self.notif_warning({
          message: "O campo final deve ser um número inteiro e positivo"
        });
        return false;
      }
      if (self.inicial > self.final) {
        self.inicial = self.final;
        self.notif_warning({
          message:
            "O cod. inicial não pode ser maior que o final e os dois foram igualados."
        });
        self.comparacao();
        return false;
      } else {
        return true;
      }
    },
    async enviarexcel(e) {
      let self = this;
      self.errorsresposta = null;
      if (e.target.files[0] !== undefined) {
        self.$q.loading.show();
        var formfile = new FormData();
        formfile.append("importar", e.target.files[0]);
        let resposta = await this.axiospost(
          self.rotadata + "excel/import",
          formfile
        );
        e.target.val = "";
        e.target.value = "";
        self.$q.loading.hide();

        self.errorsbag = false;
        if (
          typeof resposta.data.errors !== "undefined" ||
          resposta.status == 422 ||
          resposta.status == "422"
        ) {
          self.errorsresposta = resposta.data.errors;
          self.errorsbag = true;
          self.notif_danger({
            message:
              "Verifique as mensagens em vermelho ou Somente é permitido arquivos no formato: xls."
          });
        } else {
          $("#users-table")
            .DataTable()
            .ajax.reload();
          self.excel = false;
        }
      }
    },
    async baixar() {
      let self = this;
      if (self.verificafinal()) {
        self.$q.loading.show();
        self.errorsresposta = null;
        self.download_arquivo(
          self.rotadata + "excel/export/" + self.inicial + "/" + self.final,
          "xls",
          self.nomeexcel2 + ".xls"
        );
        self.$q.loading.hide();
        self.excel = false;
      }
    }
  }
};
</script>
