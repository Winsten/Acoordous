<template>
  <div>
    <q-btn-dropdown
      rounded
      ripple
      flat
      unelevated
      v-model="menu"
      @click="removeico"
      id="dropdownico"
      color="blue"
      text-color="white"
      size="16px"
      :class="{ 'hide-count': !hasUnread }"
      icon="fa fa-bell"
    >
      <q-list v-for="notification in notifications" :key="notification.id">
        <q-item v-close-popup>
          <q-item-section avatar @click="GotoPage(notification.id,notification.action_url)">
            <q-avatar size="42px">
              <img src="accordous.jpg"  alt="notificationimg" />
            </q-avatar>
          </q-item-section>
          <q-item-section @click="GotoPage(notification.id,notification.action_url)">
            <q-item-label>{{notification.title}}</q-item-label>
            <q-item-label caption>{{ notification.body }}</q-item-label>
          </q-item-section>
          <q-item-section side @click="markAsRead(notification.id)">
            <q-icon name="fa fa-times" color="red" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-list v-show="hasUnread">
        <q-item clickable v-close-popup @click="markAllRead">
          <q-item-section>
            <!-- <q-item-label>{{notification.title}}</q-item-label> -->
            <q-item-label caption>Limpar todas as notificações</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fa fa-times" color="red" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-badge align="top" v-show="hasUnread" style="margin-left: -18px" rounded color="red">{{total}}</q-badge>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
export default {
  data: () => ({
    menu: false,
    total: 0,
    teste: "",
    notifications: [],
  }),
  watch: {
    menu: function (val) {
      this.removeico();
    },
  },
  computed: {
    hasUnread() {
      return this.total > 0;
    },
  },
  mounted() {
    let self = this;
    $("#dropdownico i").removeClass(
      "fas fa-caret-down q-icon q-btn-dropdown__arrow q-btn-dropdown__arrow-container"
    );
    self.fetch();
    if (window.Echo) {
      this.listen();
    }
    // this.initDropdown();
  },
  methods: {
    /**
     * Fetch notifications.
     *
     * @param {Number} limit
     */
    removeico() {
      setTimeout(() => {
        $("#dropdownico i").removeClass(
          "fas fa-caret-down q-icon q-btn-dropdown__arrow q-btn-dropdown__arrow-container"
        );
        $("#dropdownico i").removeClass(
          "fas fa-caret-down q-icon q-btn-dropdown__arrow rotate-180 q-btn-dropdown__arrow-container"
        );
      }, 1);
    },
    async fetch(limit = 5) {
      axios
        .get("/notifications", { params: { limit } })
        .then(({ data: { total, notifications } }) => {
          this.total = total;
          this.notifications = notifications.map(({ id, data, created }) => {
            return {
              id: id,
              title: data.title,
              body: data.body,
              created: created,
              action_url: data.action_url,
            };
          });
        });

      let myVar = setInterval(() => {
        axios
          .get("/notifications", { params: { limit } })
          .then(({ data: { total, notifications } }) => {
            this.total = total;
            this.notifications = notifications.map(({ id, data, created }) => {
              return {
                id: id,
                title: data.title,
                body: data.body,
                created: created,
                action_url: data.action_url,
              };
            });
          });
      }, 300000);

      this.$store.commit("Timeoutnotification", myVar);
    },
    /**
     * Mark the given notification as read.
     *
     * @param {Object} notification
     */
    markAsRead(id) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.total--;
        this.notifications.splice(index, 1);
        axios.patch(`/notifications/${id}/read`);
      }
    },
    GotoPage(id, url) {
      this.markAsRead(id);
      url = url.replace(window.location.origin, "");
      this.$router.push(url);
    },
    /**
     * Mark all notifications as read.
     */
    markAllRead() {
      this.total = 0;
      this.notifications = [];
      axios.post("/notifications/all/mark-all-read");
    },
    /**
     * Listen for Echo push notifications.
     */
    listen() {
      window.Echo.private(`App.User.${window.Laravel.user.id}`)
        .notification((notification) => {
          this.total++;
          this.notifications.unshift(notification);
        })
        .listen("NotificationRead", ({ notificationId }) => {
          this.total--;
          const index = this.notifications.findIndex(
            (n) => n.id === notificationId
          );
          if (index > -1) {
            this.notifications.splice(index, 1);
          }
        })
        .listen("NotificationReadAll", () => {
          this.total = 0;
          this.notifications = [];
        });
    },
    /**
     * Initialize the notifications dropdown.
     */
    initDropdown() {
      const dropdown = $(this.$refs.dropdown);
      $(document).on("click", (e) => {
        if (
          !dropdown.is(e.target) &&
          dropdown.has(e.target).length === 0 &&
          !$(e.target).parent().hasClass("notification-mark-read")
        ) {
          dropdown.removeClass("open");
        }
      });
    },
    /**
     * Toggle the notifications dropdown.
     */
    toggleDropdown() {
      $(this.$refs.dropdown).toggleClass("open");
    },
  },
};
</script>