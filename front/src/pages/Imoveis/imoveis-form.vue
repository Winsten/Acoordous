<template>
<componenteform :titulo="titulo" :rotabase="rotabase">
    <slot slot="inputs">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-pa-sm">
            <q-input outlined type="email" clearable v-model="form.email" label="Email" hint="Digite o email do proprietário" lazy-rules :rules="[
            val => $v.form.email.email || 'Digite um e-mail válido.',
            val => $v.form.email.required || 'Este campo é obrigatório.'
          ]" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-pa-sm">
            <q-input outlined type="text" clearable v-model="form.rua" label="Rua" hint="Digite o nome da rua" lazy-rules inline :rules="[val => $v.form.rua.required || 'Este campo é obrigatório.']" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-pa-sm">
            <q-input outlined type="number" clearable v-model="form.numero" label="Número" hint="Digite o número" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-pa-sm">
            <q-input outlined type="text" clearable v-model="form.complemento" label="Complemento" hint="Digite o complemento" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-pa-sm">
            <q-input outlined type="text" clearable v-model="form.bairro" label="Bairro" hint="Digite o nome do bairro" lazy-rules inline :rules="[
            val => $v.form.bairro.required || 'Este campo é obrigatório.'
          ]" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-pa-sm">
            <q-input outlined type="text" clearable v-model="form.cidade" label="Cidade" hint="Digite o nome da cidade" lazy-rules inline :rules="[
            val => $v.form.cidade.required || 'Este campo é obrigatório.'
          ]" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-pa-sm">
            <q-select outlined map-options clearable v-model="form.estado" :options="estados" label="Escolha o estado" hint="Escolha o estado do imóvel." lazy-rules inline :rules="[
            val => $v.form.estado.required || 'Este campo é obrigatório.'
          ]" />
        </div>
    </slot>
</componenteform>
</template>

<script>
import {
    required,
    minLength,
    email
} from "vuelidate/lib/validators";
export default {
    data() {
        //   NO ROTABASE USAR BARRA INICIAL E FINAL COMO PADRÂO
        return {
            titulo: "imoveis",
            rotabase: "/imovel/",
            resposta: "",
            estados: [{
                    label: "Acre",
                    value: "AC"
                },
                {
                    label: "Alagoas",
                    value: "AL"
                },
                {
                    label: "Amapá",
                    value: "AP"
                },
                {
                    label: "Amazonas",
                    value: "AM"
                },
                {
                    label: "Bahia",
                    value: "BA"
                },
                {
                    label: "Ceará",
                    value: "CE"
                },
                {
                    label: "Distrito Federal",
                    value: "DF"
                },
                {
                    label: "Espírito Santo",
                    value: "ES"
                },
                {
                    label: "Goiás",
                    value: "GO"
                },
                {
                    label: "Maranhão",
                    value: "MA"
                },
                {
                    label: "Mato Grosso",
                    value: "MT"
                },
                {
                    label: "Mato Grosso do Sul",
                    value: "MS"
                },
                {
                    label: "Minas Gerais",
                    value: "MG"
                },
                {
                    label: "Paraná",
                    value: "PR"
                },
                {
                    label: "Pará",
                    value: "PA"
                },
                {
                    label: "Paraíba",
                    value: "PB"
                },
                {
                    label: "Pernambuco",
                    value: "PE"
                },
                {
                    label: "Piauí",
                    value: "PI"
                },
                {
                    label: "Rio Grande do Norte	",
                    value: "RN"
                },
                {
                    label: "Rondônia",
                    value: "RO"
                },
                {
                    label: "Roraima",
                    value: "RR"
                },
                {
                    label: "Tocantins",
                    value: "TO"
                },
                {
                    label: "Rio de Janeiro",
                    value: "RJ"
                },
                {
                    label: "Rio Grande do Sul",
                    value: "RS"
                },
                {
                    label: "Santa Catarina",
                    value: "SC"
                },
                {
                    label: "São Paulo",
                    value: "SP"
                }
            ],
            form: {
                email: "",
                rua: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: ""
            }
        };
    },
    validations: {
        form: {
            email: {
                required,
                email
            },
            rua: {
                required
            },
            bairro: {
                required
            },
            cidade: {
                required
            },
            estado: {
                required
            }
        }
    }
};
</script>
