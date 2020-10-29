<template>
  <div>
    <!-- Send notification button -->
    <!-- <button
      :disabled="loading"
      type="button"
      class="btn btn-success btn-send"
      @click="sendNotification"
    >Send Notification</button>-->

    <!-- Enable/Disable push notifications -->
    <q-btn
      :color="colorpush"
      @click="togglePush"
      icon="fa fa-bell"
      :label="labelativar"
    />
    <q-dialog
      :value="enabledialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <div class="text-h6 text-primary">Aviso sobre Notificações</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Para receber em tempo real as notificações do aplicativo e assim
          garantir uma comunicação eficaz com a Avelino, clique em ativar as
          notificações.
        </q-card-section>
        <q-card-section class="q-pt-none">
          Caso não ative as notificações o sistema ficará impossibilitado de
          enviar notificações de documentos
        </q-card-section>
        <q-card-section
          style="color: darkred; text-weigth: bold"
          class="q-pt-none"
        >
          Após clicar em ativar notificações, clique também em permitir quando o
          navegador solicitar a permissão.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import notifications from "app/src/mixin/notifications.js";

export default {
  data: () => ({
    persistent: true,
    loading: false,
    enabledialog: true,
    isPushEnabled: false,
    pushButtonDisabled: true,
    colorpush: "green",
    labelativar: "Ativar notificações",
  }),

  mounted() {
    this.registerServiceWorker();
  },
  watch: {
    isPushEnabled: function (val) {
      let self = this;
      if (val) {
        self.colorpush = "red";
        self.labelativar = "Desativar notificações";
        self.enabledialog = false;
      } else {
        self.colorpush = "green";
        self.labelativar = "Ativar notificações";
        self.enabledialog = true;
      }
    },
  },

  methods: {
    /**
     * Register the service worker.
     */
    registerServiceWorker() {
      if (!("serviceWorker" in navigator)) {
        console.log("Service workers aren't supported in this browser.");
        return;
      }

      navigator.serviceWorker
        .register(process.env.SERVICE_WORKER_FILE)
        .then(() => this.initialiseServiceWorker());
    },

    initialiseServiceWorker() {
      if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
        // console.log("Notifications aren't supported.");
        return;
      }

      if (Notification.permission === "denied") {
        console.log("The user has blocked notifications.");
        return;
      }

      if (!("PushManager" in window)) {
        console.log("Push messaging isn't supported.");
        return;
      }
      let self = this;
      self.$q.loading.show();

      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager
          .getSubscription()
          .then((subscription) => {
            this.pushButtonDisabled = false;

            if (!subscription) {
              return;
            }

            this.updateSubscription(subscription);

            this.isPushEnabled = true;

            self.$q.loading.hide();
          })
          .catch((e) => {
            console.log("Error during getSubscription()", e);

            self.$q.loading.hide();
          });
      });
    },

    /**
     * Subscribe for push notifications.
     */
    subscribe() {
      let self = this;
      let vapid = "";
      self.$q.loading.show();
      navigator.serviceWorker.ready.then((registration) => {
        const options = { userVisibleOnly: true };
        if (process.env.DEV) {
          vapid =
            "BA1Ls0sKvYd57TEM9quh-nLGesefdreL1Bj_LYfccYfCnDKq1EBNJPezBvBQeSpf9mNBuBU9590gFCzxBinPMtA";
          // Do servidor de desenvolvimento
          // VAPID_PUBLIC_KEY=BA1Ls0sKvYd57TEM9quh-nLGesefdreL1Bj_LYfccYfCnDKq1EBNJPezBvBQeSpf9mNBuBU9590gFCzxBinPMtA
          // VAPID_PRIVATE_KEY=oJ5jrUAU8kw38KRRAYm3hbHzkLgTdzmaOSskqGlpmx8
        } else {
          // Do servidor de produção avelino
          vapid =
            "BMbG9TDkGpSXm9_IOndRxhCh-wG_FXGY7kWMA8NEZ0XdLd_W5DUKk3eEUurrtuTun7-J0KB5J8mM9vFRJSHVAd8";
        }
        // VAPID SERVIDOR

        const vapidPublicKey = vapid;
        if (process.env.DEV) {
          console.log("LEMBRAR DE TROCAR O VAPID KEY PARA WEB PUSH");
          console.log("Caminho: src/components/Notifications.vue");
          console.log("vapidPublicKey", vapidPublicKey);
        }

        if (vapidPublicKey) {
          options.applicationServerKey = this.urlBase64ToUint8Array(
            vapidPublicKey
          );
        }

        registration.pushManager
          .subscribe(options)
          .then((subscription) => {
            this.isPushEnabled = true;
            this.pushButtonDisabled = false;

            this.updateSubscription(subscription);

            self.$q.loading.hide();
          })
          .catch((e) => {
            if (Notification.permission === "denied") {
              console.log("Permission for Notifications was denied");
              this.pushButtonDisabled = true;
            } else {
              console.log("Unable to subscribe to push.", e);
              this.pushButtonDisabled = false;
            }

            self.$q.loading.hide();
          });
      });
    },

    /**
     * Unsubscribe from push notifications.
     */
    unsubscribe() {
      let self = this;
      self.$q.loading.show();
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager
          .getSubscription()
          .then((subscription) => {
            if (!subscription) {
              this.isPushEnabled = false;
              this.pushButtonDisabled = false;
              return;
            }

            subscription
              .unsubscribe()
              .then(() => {
                this.deleteSubscription(subscription);

                this.isPushEnabled = false;
                this.pushButtonDisabled = false;

                self.$q.loading.hide();
              })
              .catch((e) => {
                console.log("Unsubscription error: ", e);
                this.pushButtonDisabled = false;

                self.$q.loading.hide();
              });
          })
          .catch((e) => {
            console.log("Error thrown while unsubscribing.", e);

            self.$q.loading.hide();
          });
      });
    },

    /**
     * Toggle push notifications subscription.
     */
    togglePush() {
      if (this.isPushEnabled) {
        this.unsubscribe();
      } else {
        this.subscribe();
      }
    },

    /**
     * Send a request to the server to update user's subscription.
     *
     * @param {PushSubscription} subscription
     */
    updateSubscription(subscription) {
      const key = subscription.getKey("p256dh");
      const token = subscription.getKey("auth");
      const contentEncoding = (PushManager.supportedContentEncodings || [
        "aesgcm",
      ])[0];

      const data = {
        endpoint: subscription.endpoint,
        publicKey: key
          ? btoa(String.fromCharCode.apply(null, new Uint8Array(key)))
          : null,
        authToken: token
          ? btoa(String.fromCharCode.apply(null, new Uint8Array(token)))
          : null,
        contentEncoding,
      };

      let self = this;
      self.$q.loading.show();

      axios.post("/subscriptions", data).then(() => {
        self.$q.loading.hide();
      });
    },

    /**
     * Send a requst to the server to delete user's subscription.
     *
     * @param {PushSubscription} subscription
     */
    deleteSubscription(subscription) {
      let self = this;
      self.$q.loading.show();

      axios
        .post("/subscriptions/delete", { endpoint: subscription.endpoint })
        .then(() => {
          self.$q.loading.hide();
        });
    },

    /**
     * Send a request to the server for a push notification.
     */
    sendNotification() {
      let self = this;
      self.$q.loading.show();

      axios
        .post("/notifications")
        .catch((error) => {
          console.log(error);
          self.$q.loading.hide();
        })
        .then(() => {
          self.$q.loading.hide();
        });
    },

    /**
     * https://github.com/Minishlink/physbook/blob/02a0d5d7ca0d5d2cc6d308a3a9b81244c63b3f14/app/Resources/public/js/app.js#L177
     *
     * @param  {String} base64String
     * @return {Uint8Array}
     */
    urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      return outputArray;
    },
  },
};
</script>

<style scoped>
.btn {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>