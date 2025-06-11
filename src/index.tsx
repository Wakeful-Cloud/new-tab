/**
 * @file Main entrypoint
 */

// Imports
import "virtual:uno.css";
import "~/index.css";

import {render} from "solid-js/web";

import App from "~/App";

// Get the root element
const root = document.getElementById("root")!;

// Mount the root element
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

// Render
render(() => <App />, root);
