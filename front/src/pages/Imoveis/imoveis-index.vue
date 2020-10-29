<template>
<div>
    <componenteindex :titulo="titulo" :rotabase="rotabase" :tablerow="tr" :cols="colunas" :importandexport="importandexport" :copiarlinha="copiarlinha" :nomeexcel="nomeexcel"></componenteindex>
    <q-dialog v-model="notificationdialog" persistent>
        <q-card>
            <q-form @submit="onSubmit" class="q-gutter-sm">
                <q-card-section>
                    <div v-if="createform" class="text-h6" style="color: darkblue">sCriar contrato</div>
                    <div v-if="!createform" class="text-h6" style="color: darkred">Remover contrato</div>
                </q-card-section>
                <q-card-section>
                    <q-btn-toggle name="Tipo" v-model="form.tipo" push toggle-color="blue" :options="options" />
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input dense v-model="form.nome" autofocus maxlength="30" label="Nome" title="Informe o nome completo do contratante" hint="Informe o nome completo do contratante" clearable lazy-rules :rules="[
                val => $v.form.nome.required || 'Este campo é obrigatório.'
              ]" />
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <q-input label="E-mail" title="Informe o emaildo contratante" hint="Informe o emaildo contratante" dense v-model="form.email" type="email" clearable lazy-rules :rules="[
                val => $v.form.email.email || 'Digite um e-mail válido.',
                val => $v.form.nome.required || 'Este campo é obrigatório.'
              ]" />
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <q-input v-if="form.tipo" dense v-model="form.cpf" label="CPF" title="Informe o CPF do contratante" hint="Informe o CPF do contratante" clearable mask="###.###.###-##" :rules="[
                val => $v.form.cpf.cpfvalidator || 'Digite um CPF válido.',
                val => $v.form.cpf.required || 'Este campo é obrigatório.'
              ]" />

                    <q-input v-if="!form.tipo" dense v-model="form.cnpj" label="CNPJ" title="Informe o CNPJ do contratante" hint="Informe o CNPJ do contratante" clearable mask="##.###.###/####-##" :rules="[
                val => $v.form.cnpj.cnpjvalidator || 'Digite um CNPJ válido x.',
                val => $v.form.cnpj.required || 'Este campo é obrigatório.'
              ]" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancelar" v-close-popup @click="Cancel" />
                    <q-btn flat label="Salvar contrato" v-if="createform" type="submit" color="primary" />
                    <q-btn flat label="remover contrato" v-if="!createform" type="submit" color="negative" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</div>
</template>

<script>
import {
    required,
    minLength,
    email
} from "vuelidate/lib/validators";
import {
    cpf
} from "cpf-cnpj-validator";
import {
    cnpj
} from "cpf-cnpj-validator";
const cpfvalidator = value => cpf.isValid(value);
const cnpjvalidator = value => cnpj.isValid(value);
import ajaxaxios from "app/src/mixin/ajaxaxios.js";
import notifications from "app/src/mixin/notifications.js";
export default {
    //   NO ROTABASE USAR BARRA INICIAL E FINAL COMO PADRÂO
    mixins: [ajaxaxios, notifications],
    data() {
        return {
            importandexport: false,
            importandexport: false,
            copiarlinha: false,
            nomeexcel: "Imoveis",
            titulo: "de imoveis",
            rotabase: "/imovel/",
            tr: "<tr><th>Cod./id</th><th>Endereço</th><th>Status</th><th>Ações</th></tr>",
            options: [{
                    label: "Pessoa Física",
                    value: true
                },
                {
                    label: "Pessoa Jurídica",
                    value: false
                }
            ],
            colunas: [{
                    data: "id",
                    name: "id"
                },
                {
                    data: "endereco",
                    name: "endereco"
                },
                {
                    data: "status",
                    name: "status"
                },
                {
                    data: "action",
                    name: "action",
                    orderable: false,
                    searchable: false
                }
            ],
            form: {
                localid: "",
                nome: "",
                cpf: "",
                cnpj: "",
                email: "",
                tipo: true
            },
            notificationdialog: false,
            createform: true
        };
    },
    beforeCreate() {},
    async mounted() {
        let self = this;

        $("#users-table").on("click", "button.datatables_contrato", function (e) {
            self.createform = true;
            self.form.localid = $(this).val();
            self.notificationdialog = true;
        });

        $("#users-table").on("click", "button.datatables_remover_contrato", function (e) {
            self.createform = false;
            self.show($(this).val())
        });
    },
    methods: {
        async show(id) {
            let self = this;
            let response = await self.axiosget("/contrato/" + id + "/edit");
            if (response.status == 200) {
                response = response.data[0];
                console.log(response);
                self.form.localid = id;
                self.form.nome = response.nome;
                if (response.cpf == null) {
                    self.form.cnpj = response.cnpj;
                    self.form.tipo = false;
                } else {
                    self.form.cpf = response.cpf;
                    self.form.tipo = true;
                }
                self.form.email = response.email;
                self.notificationdialog = true;
            }
        },
        Cancel() {
            this.ClearForm();
        },
        ClearForm() {
            let self = this;
            self.form.localid = "";
            self.form.nome = "";
            self.form.cpf = "";
            self.form.cnpj = "";
            self.form.email = "";
            self.form.tipo = true;
            $("#users-table")
                .DataTable()
                .ajax.reload();
            self.notificationdialog = false;
        },

        async onSubmit(evt) {
            let self = this;
            let resposta = '';
            if (!self.createform) {
                resposta = await self.axiosdelete(self.form.localid, "/contrato/");
                console.log('resposta', resposta);
                self.ClearForm();
                self.notificationdialog = false;
            } else {

                let fd = new FormData();
                fd.append("imovel_id", self.form.localid);
                fd.append("nome", self.form.nome);
                if (self.form.tipo) {
                    fd.append("cpf", self.form.cpf);
                } else {
                    fd.append("cnpj", self.form.cnpj);
                }
                fd.append("email", self.form.email);
                fd.append("tipo", self.form.tipo);
                resposta = await self.axiospost("/contrato", fd);
                self.errorsbag = false;
                if (resposta.status == 422 || resposta.status == "422") {
                    self.errorsresposta = resposta.data.errors;
                    self.errorsbag = true;
                } else {
                    self.ClearForm();
                }
            }
        }
    },
    validations: {
        form: {
            email: {
                required,
                email
            },
            nome: {
                required
            },
            cpf: {
                cpfvalidator,
                required
            },
            cnpj: {
                cnpjvalidator,
                required
            }
        }
    }
};
</script>
