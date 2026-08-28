/**
 * @file Main entrypoint
 */

import {createPinia} from "pinia";
import "virtual:uno.css";
import {createApp} from "vue";
import App from "~/app.vue";
import "~/main.css";

// Create the app
const app = createApp(App);

// Create the Pinia instance
const pinia = createPinia();

// Mount the root element
app.use(pinia).mount("#root");
