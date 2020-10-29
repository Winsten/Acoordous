<template>
<q-layout view="hHr lpR fFf">
    <q-header elevated>
        <q-toolbar class="bg-black text-white shadow-2 rounded-borders">
            <q-toolbar-title>
                Accordous
            </q-toolbar-title>
            <q-btn flat dense round icon="fas fa-bars" aria-label="Menu" @click="right = !right" />
        </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="right" side="right" bordered content-class="bg-grey-1">
        <q-list>
            <q-item class="text-black-10" clickable @click="home">
                <q-item-section avatar>
                    <q-icon size="2.9em" class="text-black-10" name="fas fa-house-user" />
                </q-item-section>

                <q-item-section>
                    <q-item-label>Início</q-item-label>
                    <q-item-label caption>Voltar a tela inicial</q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black-10" clickable @click="imoveis">
                <q-item-section avatar>
                    <q-icon size="2.9em" class="text-black-10" name="fas fa-hotel" />
                </q-item-section>

                <q-item-section>
                    <q-item-label>Imóveis \ Contrato</q-item-label>
                    <q-item-label caption>Cadastro de imóveis e contrato</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-drawer>

    <q-page-container>
        <router-view />
    </q-page-container>
</q-layout>
</template>

<script>
export default {
    name: "MainLayout",
    mounted() {
        window.addEventListener('resize', function () {
            $("#users-table").css("width", "100%!important");
        });
    },
    data() {
        return {
            right: false
        };
    },
    methods: {
        home() {
            this.$router.push("/");
        },
        imoveis() {
            this.$router.push("/imovel");
        }
    }
};
</script>
