import {
  componenteindex,
  componenteform,
  webpush,
  NotificationsDropBox
} from "./index";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(Vue) {
    Vue.component("componenteindex", componenteindex);
    Vue.component("componenteform", componenteform);
    Vue.component("webpush", webpush);
    Vue.component("notificationsdropdown", NotificationsDropBox);
  }
};

export default GlobalComponents;
