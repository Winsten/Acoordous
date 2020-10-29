// Componente utilizado para criar um form nele é somente passados os campos com as validações que este já implementa todos os itens do layout
// Automaticamente pecorre o formulário e monta o request
// Bastando apenas passar as propriedades VUE que o sistema se encarrega do resto.
<template>
<div class="row q-pa-md">
    <div class="col-12 shadow-7">
        <!-- Botões do topo do formulário usados na navegação dentre outros -->
        <div class="col-12 q-pa-sm flex-center text-center">
            <h5 class="text-blue q-ma-sm">{{ titulocard }}</h5>
            <hr />
            <q-btn color="primary" v-if="btncriar" @click="tocreate" class="q-ma-xs" label="Criar" />
            <q-btn color="secondary" v-if="btnvoltar" :to="rotadata" class="q-ma-xs" label="Voltar" />

            <q-btn color="positive" v-if="btneditar" @click="toedit" class="q-ma-xs" label="Editar" />

            <q-btn color="red" @click="deleteitem" v-if="btndeletar" class="q-ma-xs" label="Deletar" />
        </div>
        <!-- Erros bags utilizado para pegar erros do formulário request do laravel. -->
        <div class="col-12 q-pa-sm" v-if="errorsresposta != null && errorsbag">
            <q-banner v-for="item in errorsresposta" v-bind:data="item" v-bind:key="item.text" class="text-white bg-red q-ma-xs">
                <strong>{{ item[0] }}</strong>
            </q-banner>
        </div>
        <!-- Botões padrões de Create e de update "Criar e Atualizar" -->
        <div class="col-12 q-pa-sm">
            <q-form class="q-pa-xs q-gutter-md" v-if="formcreate" @submit="Create">
                <div class="row">
                    <slot name="inputs"></slot>
                </div>
                <div class="col-12 q-pa-sm flex-center text-center" aling="center">
                    <q-btn color="primary" type="submit" v-if="btndebaixocreate" class="q-ma-xs" label="Criar" />
                    <slot name="botoes"></slot>
                </div>
            </q-form>
            <q-form class="q-pa-xs q-gutter-md" v-if="!formcreate" @submit="Update">
                <div class="row">
                    <slot name="inputs"></slot>
                    <div class="col-12 q-pa-sm flex-center text-center" aling="center">
                        <q-btn color="positive" type="submit" class="q-ma-xs" label="Atualizar" />
                        <slot name="botoes"></slot>
                    </div>
                </div>
            </q-form>
        </div>
    </div>
</div>
</template>

<style>
input:disabled {
    background: #f2f2f2;
}
</style>

<script>
import ajaxaxios from "app/src/mixin/ajaxaxios.js";
import notifications from "app/src/mixin/notifications.js";
export default {
    mixins: [ajaxaxios, notifications],
    props: {
        // propriedade obrigatória
        titulo: {
            type: String
        },
        // propriedade obrigatória e normalmente é passada entre duas / ex: /imoveis/
        rotabase: {
            type: String
        },
        btnedit: {
            type: Boolean,
            default: false
        },
        btnreturn: {
            type: Boolean,
            default: true
        },
        btncreate: {
            type: Boolean,
            default: false
        },
        btndelete: {
            type: Boolean,
            default: false
        },
        routerredirectpostorupdate: {
            type: String,
            default: ""
        },
        validacoes: Array,
    },
    data() {
        return {
            btnvoltar: this.btnreturn,
            btncriar: this.btncreate,
            btneditar: this.btnedit,
            btndeletar: this.btndelete,
            rotadata: this.rotabase,
            title: this.titulo,
            formcreate: true,
            btndebaixocreate: true,
            errorsbag: false,
            validate: this.validacoes,
            errorsresposta: null,
            botaocomandos: "",
            resposta: "",
            titulocard: "Criar " + this.title,
        };
    },
    watch: {
        $route(to, from) {
            //update the variables with new route params
            let self = this;
            this.ChangeLocal();
            // if (this.$parent.temimagens != undefined) {
            //   this.Inicial();
            // }

            // serve para limpar o formulário no create vindo ou do edit ou do update
            let tocrate = to.path.split("/");
            tocrate = tocrate[tocrate.length - 1];
            if (tocrate == "create") {
                Object.keys(self.$parent.form).forEach(function (key, index) {
                    self.$parent.form[key] = null;
                });
            }
            // serve para limpar o formulário no create vindo ou do edit ou do update
        },
    },
    async mounted() {
        let self = this;
        self.Inicial();
    },
    methods: {
        deleteitem() {
            let self = this;
            self.axiosdelete(self.$route.params.id, self.rotadata);
        },
        tocreate() {
            this.$router.push(this.rotadata + "create");
        },
        toedit() {
            this.$router.push(this.rotadata + this.$route.params.id + "/edit");
        },
        async Inicial() {
            let self = this;
            self.botaocomandos = self.rotadata;
            self.ChangeLocal();
            self.resposta = null;
            if (self.$route.params.id != undefined) {
                self.resposta = await self.axiosget(
                    self.rotadata + self.$route.params.id + "/edit"
                );
                self.resposta = self.resposta.data;
            } else {
                // await self.axiosget(self.rotadata + "create");
            }

            // usado para preencher o formulario caso seja edit ou view
            if (typeof self.$parent.OnMounted == "undefined") {
                if (self.$route.params.id != undefined) {
                    Object.keys(self.$parent.form).forEach(function (key, index) {
                        self.$parent.form[key] = self.resposta[key];
                    });
                }
            } else {
                self.$parent.OnMounted();
            }
        },
        async ChangeLocal() {
            let self = this;
            self.btneditar = false;
            self.btncriar = false;

            // caso seja edit entra aqui
            if (self.$route.params.edit != undefined) {
                self.titulocard = "Editar " + self.title;
                self.formcreate = false;
                self.btncriar = true;
                $("input,select,textarea").each(function () {
                    $(this).prop("disabled", false);
                });
            } else {
                // caso seja create entra aqui
                let url_id_item2 = self.$router.history.current.path.split("/");
                url_id_item2 = url_id_item2[url_id_item2.length - 1];
                if (url_id_item2 == "create") {
                    self.titulocard = "Criar " + self.title;
                    self.formcreate = true;
                    self.btndebaixocreate = true;
                    $("input,select,textarea").each(function () {
                        $(this).prop("disabled", false);
                    });
                } else {
                    // caso seja cópiar um item entra aqui
                    if (self.$route.params.copy != undefined) {
                        self.titulocard = "Criar " + self.title;
                        self.btneditar = false;
                        self.btncriar = false;
                        $("input,select,textarea").each(function () {
                            $(this).prop("disabled", false);
                        });
                    } else {
                        // caso seja somente visualizar o produto
                        $("input,select,textarea").each(function () {
                            $(this).prop("disabled", true);
                        });
                        self.titulocard = "Visualizar " + self.title;
                        self.btndebaixocreate = false;
                        self.btneditar = true;
                        self.btncriar = true;
                        self.formcreate = true;
                    }
                }
            }
        },
        async GenForm(itens) {
            // Método usado para vasculhar o formulário e preencher os itens do form request
            let fd = new FormData();
            let itens2 = itens;
            Object.keys(itens).forEach(function (key, index) {
                if (typeof itens2[key] == "object") {
                    fd.append(key, itens2[key].value);
                } else {
                    fd.append(key, itens2[key]);
                }
            });
            return fd;
        },
        async Create() {
            let self = this;
            // serve para usar ou usar a geração do formulario automático ou usar uma função no form
            // ex: para usar o form manual no formulário basta colocar a função GenerateForm
            let fd = "";
            if (typeof self.$parent.GenerateForm == "undefined") {
                fd = await self.GenForm(self.$parent.form);
            } else {
                fd = await self.$parent.GenerateForm();
            }

            if (fd != "n") {
                let localpost = self.rotadata.substring(0, self.rotadata.length - 1);
                let resposta = await self.axiospost(localpost, fd);
                self.errorsbag = false;
                if (resposta.status == 422 || resposta.status == "422") {
                    self.errorsresposta = resposta.data.errors;
                    self.errorsbag = true;
                }
                if (
                    resposta.status == 201 ||
                    resposta.status == "201" ||
                    resposta.status == 200 ||
                    resposta.status == "200"
                ) {
                    self.ChangeLocal();
                    // self.$router.push(self.rotadata + resposta.data.id + "/edit");
                    if (self.$props.routerredirectpostorupdate == "") {
                        self.$router.push(self.rotadata);
                    } else {
                        self.$router.push(self.$props.routerredirectpostorupdate);
                    }
                }
            }
        },
        async Update() {
            let self = this;
            this.$q.loading.show();
            // serve para usar ou usar a geração do formulario automático ou usar uma função no form
            // ex: para usar o form manual no formulário basta colocar a função GenerateForm
            let fd = "";
            if (typeof self.$parent.GenerateForm == "undefined") {
                fd = await self.GenForm(self.$parent.form);
            } else {
                fd = await self.$parent.GenerateForm();
            }

            if (fd != "n") {
                fd.append("id", self.$route.params.id);
                let resposta = await self.axiosput(
                    self.rotadata + self.$route.params.id,
                    fd
                );
                self.errorsbag = false;
                if (resposta.status == 422 || resposta.status == "422") {
                    self.errorsresposta = resposta.data.errors;
                    self.errorsbag = true;
                }
                if (
                    resposta.status == 201 ||
                    resposta.status == "201" ||
                    resposta.status == 200 ||
                    resposta.status == "200"
                ) {
                    // self.ChangeLocal();
                    if (self.$props.routerredirectpostorupdate == "") {
                        self.$router.push(self.rotadata);
                    } else {
                        self.$router.push(self.$props.routerredirectpostorupdate);
                    }
                }
            }
        },
    },
};
</script>

<style>
</style>
